# webpack-server-html

> Plugin for [webpack](https://github.com/webpack/webpack).

Create the base HTML page for a webpack static site.  EJS was the suggested solution when this was created; this is a javascript created HTML page alternative.

## Requirements

* [webpack](https://nodejs.org/en/download/) - version >= 4

## Install

```
$ npm install --save-dev @elricb/webpack-server-html
```

## Example

webpack.config.js

```javascript
const WebpackServerHtml = require("@elricb/webpack-server-html");

const webpackConfig = {
  // Config items
  plugins: [
    new WebpackServerHTML(`app/server.js`, {
      [`index.html`]: {
        mountId: "app",
        title: "My Site Title",
        favicon: {
          ico: "/assets/favicon.ico"
        },
        store: { host: "mysite.com", path: "/", staticUrl: "/assets" },
      },
    })
  ],
  // Config items
};
```

app/server.js

```javascript
module.exports = (configData, entryFiles) => {
  const scriptHtml = entryFiles.reduce(
    (html, src) => (html + `<script src="${src}"></script>`),
    ""
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${configData.title}</title>

  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width, initial-scale=2.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link id="favicon" rel="shortcut icon" type="image/x-icon" href="${configData.favicon.ico}" />
</head>
<body>
  <script>
    document.domain = '${configData.store.host}';
    window['$store']=${configData.store};
  </script>
  <div id="${configData.mountId}"></div>
  ${scriptHtml}
</body>
</html>`;
};
```


## class WebpackServerHtml

```javascript
const webpackServerHtml = new WebpackServerHtml(file, config);
```

### file

Type: `string`

Location of the javascript file returning a function that returns an HTML string.

```javascript
module.exports = function(configData, entryFiles) {
  return "<html></html>";
};
```

#### configData

Type: `object`

The object value under filename sent from webpack config.

#### entryFiles

Type: `array`

The webpack entry script file names that should be referenced in base HTML.

### config

Type: `object`

Output filename as object key.  Object value contains all data sent to javascript file.

```javascript
{
  "output-file-name.html": {
    data: "",
    sent: "",
    to: "",
    file: ""
  }
}
```

If multiple filenames are set, the javascript file is called multiple times with each subset of data.

```javascript
{
  "index.html": {
    data: "",
    sent: "",
    to: "",
    file: ""
  },
  "about/index.html": {
    data: "",
    sent: "",
    to: "",
    file: ""
  },
  "support/index.html": {
    data: "",
    sent: "",
    to: "",
    file: ""
  }
}
```

