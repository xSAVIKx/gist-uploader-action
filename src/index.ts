import { getInput, setFailed, setOutput } from "@actions/core";
import runAction from "./action.js";

runAction({
  token: getInput("token", { trimWhitespace: true }),
  gistId: getInput("gist_id", { trimWhitespace: true }),
  gistDescription: getInput("gist_description", { trimWhitespace: true }),
  gistFileName: getInput("gist_file_name", { trimWhitespace: true }),
  filePath: getInput("file_path", { trimWhitespace: true }),
  fileType: getInput("file_type", { trimWhitespace: true }),
})
  .then((output) => {
    setOutput("url", output.url);
    process.exit(0);
  })
  .catch((error) => {
    setFailed(error);
    process.exit(1);
  });
