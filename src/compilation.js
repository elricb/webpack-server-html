module.exports = {
  getUri: compilation => compilation.outputOptions.publicPath,
  getBuildPath: compilation => compilation.outputOptions.path,
  getEntryFiles: (uri, compilation) =>
    ((compilation.chunkGroups[0] || {}).chunks || [])
      .reduce((a, chunk) => a.concat(chunk.files || []), [])
      .map(v => uri + v),
  isDevServer: compilation =>
    !!compilation.options.devServer || compilation.options.mode === "development"
};
