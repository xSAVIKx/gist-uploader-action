import { getBooleanInput, getInput, setFailed, setOutput } from "@actions/core";
import runAction from "./action.js";

const DEFAULT_DESCRIPTION = "Gist updated using https://github.com/xSAVIKx/gist-uploader-action action";

runAction({
  token: getInput("token", { trimWhitespace: true }),
  gistId: getInput("gist_id", { trimWhitespace: true }),
  gistDescription: getInput("gist_description", { trimWhitespace: true, required: false }) || DEFAULT_DESCRIPTION,
  gistFileName: getInput("gist_file_name", { trimWhitespace: true, required: false }),
  filePath: getInput("file_path", { trimWhitespace: true }),
  isPublic: getBooleanInput("is_public", { trimWhitespace: true, required: false }) || false,
})
  .then((output) => {
    setOutput("url", output.url);
    process.exit(0);
  })
  .catch((error) => {
    setFailed(error);
    process.exit(1);
  });
