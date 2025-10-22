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
  gistDescription?: string;
  /**
   * File name in the gist.
   */
  gistFileName?: string;
  /**
   * Path of the file to be deployed.
   */
  filePath: string;
  /**
   * File type of the file to be deployed.
   */
  fileType?: string;
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
  const url = "";
  return {
    url,
  };
};
