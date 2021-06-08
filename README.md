# PHP Index Webpack Plugin

Outputs an `index.php` file that imports your PHP entry script.

## Getting Started

The package is not currently published to npm, so you can instead install it directly from this repo.

```bash
npm install https://github.com/drakuno/php-index-webpack-plugin.git
```

To use it, import the module into your webpack configuration and initialize it as a plugin!

```js
const PhpIndexWebpackPlugin = require("php-index-webpack-plugin");

module.exports = {
  //...
  plugins:
  [
    //...
    new PhpIndexWebpackPlugin({
      phpEntry: "./src/index.php",
      distPathConst: "PROJECT_DIST_DIR",
      includeHtaccess: true,
    }),
  ],
}
```

## Options

### `phpEntry`
Type: `String` - Default: `'./src/index.php'`

Location of the PHP entry script that the output `index.php` should require.

### `includeHtaccess`
Type: `String|Boolean` - Default: `true`

Whether or not to also output an `.htaccess` file (usually for url rewriting). When the value is `true`, a default `.htaccess` file is output. When it is a string, then it must resolve to a file, which will be used as the source file for the output.

#### Contents of default `.htaccess`
```apache
RewriteEngine On

RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule .* index.php
```

### `distPathConst`
Type : `String` - Default: `null`

If specified, the output `index.php` will `define` a constant with the name provided and set its value to the webpack output directory.

## Example `index.php` output

```php
<?php define("PROJECT_DIST_DIR",__DIR__);require("../src/index.php");
```

## Usage notes

As shown in the example above, the path to the entry script is referenced relative to the output directory.

---

Cheers! 🐉