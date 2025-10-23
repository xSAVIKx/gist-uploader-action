import { promises as fs } from "node:fs";
import { basename, resolve } from "node:path";
import { endGroup, info, startGroup } from "@actions/core";
import { getOctokit } from "@actions/github";

/**
 * Represents the structure of the input data.
 */
export type Input = {
  /**
   * Personal access token for updating gist.
   */
  token: string;
  /**
   * ID of the gist to be updated.
   */
  gistId: string;
  /**
   * Description of the gist.
   */
  gistDescription: string;
  /**
   * File name in the gist.
   */
  gistFileName?: string;
  /**
   * Path of the file to be deployed.
   */
  filePath: string;

  /**
   * Whether the gist is public or not.
   */
  isPublic: boolean;
};

/**
 * Represents the structure of the output data.
 */
export type Output = {
  /**
   * The URL to the updated gist.
   */
  url: string;
};

export default async (options: Input): Promise<Output> => {
  let { token, gistId, gistDescription, gistFileName, filePath, isPublic } = options;
  const octokit = getOctokit(token);
  const workspace = process.env.GITHUB_WORKSPACE ?? process.cwd();
  filePath = resolve(workspace, filePath);

  if (gistFileName === undefined) {
    gistFileName = basename(filePath);
  }

  startGroup("Inputs");
  if (gistId !== undefined) {
    info(`[INFO] Gist Id: ${gistId}`);
  } else {
    info(`[INFO] Is Public: ${isPublic}`);
  }
  if (gistDescription !== undefined) {
    info(`[INFO] Description: ${gistDescription}`);
  }
  info(`[INFO] File name: ${gistFileName}`);
  info(`[INFO] File path: ${filePath}`);
  endGroup();

  startGroup("Deploy to gist");
  const content = await fs.readFile(filePath, "utf-8");
  if (gistId === undefined) {
    const response = await octokit.rest.gists.create({
      files: { [gistFileName]: { content } },
      public: isPublic,
    });
    if (!response.data.id) {
      throw new Error("Failed to create gist");
    }
    gistId = response.data.id;
    info(`[INFO] Created gist "${gistId}"`);
  } else {
    await octokit.rest.gists.update({
      gist_id: gistId,
      files: { [gistFileName]: { content } },
      description: gistDescription,
    });
    info(`[INFO] Updated gist "${gistId}"`);
  }
  endGroup();
  const url = `https://gist.github.com/${gistId}`;
  return {
    url,
  };
};
