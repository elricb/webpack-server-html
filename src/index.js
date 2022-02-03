const fs = require("fs");
const path = require("path");
const { RawSource } = require("webpack-sources");
const { getUri, getBuildPath, getEntryFiles, isDevServer } = require("./compilation");
const NAME = "WebpackServerRender";

class WebpackServerRender {
  /**
   * @param String inputJsFile - js file path returning HTML string
   * @param String outputHtmlFile - Object {[String fileName]: Object config}
   *
   * inputJsFile(
   *   @param Object config
   *   @param Array entry files
   *   @param Object compilation
   * )
   */
  constructor(inputJsFile, outputHtmlFile) {
    this.options = { inputJsFile, outputHtmlFile };
  }
  apply(compiler) {
    const { inputJsFile, outputHtmlFile } = this.options,
      isValid = typeof outputHtmlFile === "object" && outputHtmlFile !== null;

    if (!isValid) {
      throw new Error(
        `${NAME}: invalid outputHtmlFile config, should be: Object {"/place/name.html": Object config}`
      );
    }

    compiler.hooks.emit.tapAsync(NAME, (compilation, callback) => {
      const entryFiles = getEntryFiles(getUri(compilation), compilation);

      Object.keys(outputHtmlFile).forEach(htmlFile => {
        compilation.assets[htmlFile] = new RawSource(
          require(inputJsFile)(outputHtmlFile[htmlFile], entryFiles, compilation)
        );
      });
      callback();
    });
  }
}

module.exports = WebpackServerRender;
