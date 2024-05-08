const app = require('./app/app.js');
const setup = require('./scripts/setup.js');
//const dbConfig = require("../app/db.config.js");
const mongoose = require('mongoose');
//const db = require('./app/models');
const uri = "mongodb+srv://sofiazandona:MongoDB17@cluster0.6a7o7gj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

//const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
mongoose
  .connect(uri/*,{useNewUrlParser: true, useUnifiedTopology: true}*/)
  .then(() => {
    console.log('| Connesso a MongoDB | HOST: localhost:27017');
  })
  .catch((error) => {
    console.log(
      '| Si è verificato un errore durante la connessione a MongoDB: ',
      error
    );
  });

/**
 * https://devcenter.heroku.com/articles/preparing-a-codebase-for-heroku-deployment#4-listen-on-the-correct-port
 */
const port = process.env.PORT || 3000;


/**
 * Configure mongoose
 */
// mongoose.Promise = global.Promise;
// app.locals.db = mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
// .then ( () => {
    
//     console.log("Connected to Database");
    
//     app.listen(port, () => {
//         console.log(`Server listening on port ${port}`);
//     });
    
// });





// {
//   "name": "tncopy",
//   "version": "1.0.0",
//   "main": "index.js",
//   "dependencies": {
//     "abab": "^2.0.6",
//     "accepts": "^1.3.8",
//     "acorn": "^8.8.2",
//     "acorn-globals": "^6.0.0",
//     "acorn-walk": "^7.2.0",
//     "agent-base": "^6.0.2",
//     "ansi-escapes": "^4.3.2",
//     "ansi-regex": "^5.0.1",
//     "ansi-styles": "^4.3.0",
//     "anymatch": "^3.1.3",
//     "argparse": "^1.0.10",
//     "arr-diff": "^4.0.0",
//     "arr-flatten": "^1.1.0",
//     "arr-union": "^3.1.0",
//     "array-flatten": "^1.1.1",
//     "array-unique": "^0.3.2",
//     "asap": "^2.0.6",
//     "assign-symbols": "^1.0.0",
//     "asynckit": "^0.4.0",
//     "atob": "^2.1.2",
//     "babel-jest": "^26.6.3",
//     "babel-plugin-istanbul": "^6.1.1",
//     "babel-plugin-jest-hoist": "^26.6.2",
//     "babel-preset-current-node-syntax": "^1.0.1",
//     "babel-preset-jest": "^26.6.2",
//     "balanced-match": "^1.0.2",
//     "base": "^0.11.2",
//     "bl": "^2.2.1",
//     "bluebird": "^3.5.1",
//     "body-parser": "^1.20.1",
//     "brace-expansion": "^1.1.11",
//     "braces": "^3.0.2",
//     "browser-process-hrtime": "^1.0.0",
//     "browserslist": "^4.21.5",
//     "bser": "^2.1.1",
//     "bson": "^1.1.6",
//     "buffer-equal-constant-time": "^1.0.1",
//     "buffer-from": "^1.1.2",
//     "bytes": "^3.1.2",
//     "cache-base": "^1.0.1",
//     "call-bind": "^1.0.2",
//     "callsites": "^3.1.0",
//     "camelcase": "^5.3.1",
//     "caniuse-lite": "^1.0.30001487",
//     "capture-exit": "^2.0.0",
//     "chalk": "^4.1.2",
//     "char-regex": "^1.0.2",
//     "ci-info": "^2.0.0",
//     "cjs-module-lexer": "^0.6.0",
//     "class-utils": "^0.3.6",
//     "cliui": "^6.0.0",
//     "co": "^4.6.0",
//     "collect-v8-coverage": "^1.0.1",
//     "collection-visit": "^1.0.0",
//     "color-convert": "^2.0.1",
//     "color-name": "^1.1.4",
//     "combined-stream": "^1.0.8",
//     "component-emitter": "^1.3.0",
//     "concat-map": "^0.0.1",
//     "content-disposition": "^0.5.4",
//     "content-type": "^1.0.5",
//     "convert-source-map": "^1.9.0",
//     "cookie": "^0.5.0",
//     "cookie-signature": "^1.0.6",
//     "cookiejar": "^2.1.4",
//     "copy-descriptor": "^0.1.1",
//     "core-util-is": "^1.0.3",
//     "cors": "^2.8.5",
//     "cross-spawn": "^7.0.3",
//     "cssom": "^0.4.4",
//     "cssstyle": "^2.3.0",
//     "csstype": "^3.1.2",
//     "data-urls": "^2.0.0",
//     "debug": "^2.6.9",
//     "decamelize": "^1.2.0",
//     "decimal.js": "^10.4.3",
//     "decode-uri-component": "^0.2.2",
//     "deep-is": "^0.1.4",
//     "deepmerge": "^4.3.1",
//     "define-property": "^2.0.2",
//     "delayed-stream": "^1.0.0",
//     "denque": "^1.5.1",
//     "depd": "^2.0.0",
//     "destroy": "^1.2.0",
//     "detect-newline": "^3.1.0",
//     "dezalgo": "^1.0.4",
//     "diff-sequences": "^26.6.2",
//     "domexception": "^2.0.1",
//     "dotenv": "^8.6.0",
//     "ecdsa-sig-formatter": "^1.0.11",
//     "ee-first": "^1.1.1",
//     "electron-to-chromium": "^1.4.396",
//     "emittery": "^0.7.2",
//     "emoji-regex": "^8.0.0",
//     "encodeurl": "^1.0.2",
//     "end-of-stream": "^1.4.4",
//     "error-ex": "^1.3.2",
//     "esbuild": "^0.14.54",
//     "esbuild-windows-64": "^0.14.54",
//     "escalade": "^3.1.1",
//     "escape-html": "^1.0.3",
//     "escape-string-regexp": "^2.0.0",
//     "escodegen": "^2.0.0",
//     "esprima": "^4.0.1",
//     "estraverse": "^5.3.0",
//     "estree-walker": "^2.0.2",
//     "esutils": "^2.0.3",
//     "etag": "^1.8.1",
//     "exec-sh": "^0.3.6",
//     "execa": "^4.1.0",
//     "exit": "^0.1.2",
//     "expand-brackets": "^2.1.4",
//     "expect": "^26.6.2",
//     "express": "^4.19.2",
//     "extend-shallow": "^3.0.2",
//     "extglob": "^2.0.4",
//     "fast-json-stable-stringify": "^2.1.0",
//     "fast-levenshtein": "^2.0.6",
//     "fast-safe-stringify": "^2.1.1",
//     "fb-watchman": "^2.0.2",
//     "fill-range": "^7.0.1",
//     "finalhandler": "^1.2.0",
//     "find-up": "^4.1.0",
//     "for-in": "^1.0.2",
//     "form-data": "^3.0.1",
//     "formidable": "^2.1.2",
//     "forwarded": "^0.2.0",
//     "fragment-cache": "^0.2.1",
//     "fresh": "^0.5.2",
//     "fs.realpath": "^1.0.0",
//     "function-bind": "^1.1.1",
//     "gensync": "^1.0.0-beta.2",
//     "get-caller-file": "^2.0.5",
//     "get-intrinsic": "^1.2.1",
//     "get-package-type": "^0.1.0",
//     "get-stream": "^5.2.0",
//     "get-value": "^2.0.6",
//     "glob": "^7.2.3",
//     "globals": "^11.12.0",
//     "graceful-fs": "^4.2.11",
//     "growly": "^1.3.0",
//     "has": "^1.0.3",
//     "has-flag": "^4.0.0",
//     "has-proto": "^1.0.1",
//     "has-symbols": "^1.0.3",
//     "has-value": "^1.0.0",
//     "has-values": "^1.0.0",
//     "hexoid": "^1.0.0",
//     "hosted-git-info": "^2.8.9",
//     "html-encoding-sniffer": "^2.0.1",
//     "html-escaper": "^2.0.2",
//     "http-errors": "^2.0.0",
//     "http-proxy-agent": "^4.0.1",
//     "https-proxy-agent": "^5.0.1",
//     "human-signals": "^1.1.1",
//     "iconv-lite": "^0.4.24",
//     "import-local": "^3.1.0",
//     "imurmurhash": "^0.1.4",
//     "inflight": "^1.0.6",
//     "inherits": "^2.0.4",
//     "ipaddr.js": "^1.9.1",
//     "is-accessor-descriptor": "^1.0.0",
//     "is-arrayish": "^0.2.1",
//     "is-buffer": "^1.1.6",
//     "is-ci": "^2.0.0",
//     "is-core-module": "^2.12.0",
//     "is-data-descriptor": "^1.0.0",
//     "is-descriptor": "^1.0.2",
//     "is-docker": "^2.2.1",
//     "is-extendable": "^1.0.1",
//     "is-fullwidth-code-point": "^3.0.0",
//     "is-generator-fn": "^2.1.0",
//     "is-number": "^7.0.0",
//     "is-plain-object": "^2.0.4",
//     "is-potential-custom-element-name": "^1.0.1",
//     "is-stream": "^2.0.1",
//     "is-typedarray": "^1.0.0",
//     "is-windows": "^1.0.2",
//     "is-wsl": "^2.2.0",
//     "isarray": "^1.0.0",
//     "isexe": "^2.0.0",
//     "isobject": "^3.0.1",
//     "istanbul-lib-coverage": "^3.2.0",
//     "istanbul-lib-instrument": "^4.0.3",
//     "istanbul-lib-report": "^3.0.0",
//     "istanbul-lib-source-maps": "^4.0.1",
//     "istanbul-reports": "^3.1.5",
//     "jest": "^26.6.3",
//     "jest-changed-files": "^26.6.2",
//     "jest-cli": "^26.6.3",
//     "jest-config": "^26.6.3",
//     "jest-diff": "^26.6.2",
//     "jest-docblock": "^26.0.0",
//     "jest-each": "^26.6.2",
//     "jest-environment-jsdom": "^26.6.2",
//     "jest-environment-node": "^26.6.2",
//     "jest-get-type": "^26.3.0",
//     "jest-haste-map": "^26.6.2",
//     "jest-jasmine2": "^26.6.3",
//     "jest-leak-detector": "^26.6.2",
//     "jest-matcher-utils": "^26.6.2",
//     "jest-message-util": "^26.6.2",
//     "jest-mock": "^26.6.2",
//     "jest-pnp-resolver": "^1.2.3",
//     "jest-regex-util": "^26.0.0",
//     "jest-resolve": "^26.6.2",
//     "jest-resolve-dependencies": "^26.6.3",
//     "jest-runner": "^26.6.3",
//     "jest-runtime": "^26.6.3",
//     "jest-serializer": "^26.6.2",
//     "jest-snapshot": "^26.6.2",
//     "jest-util": "^26.6.2",
//     "jest-validate": "^26.6.2",
//     "jest-watcher": "^26.6.2",
//     "jest-worker": "^26.6.2",
//     "js-tokens": "^4.0.0",
//     "js-yaml": "^3.14.1",
//     "jsdom": "^16.7.0",
//     "jsesc": "^2.5.2",
//     "json-parse-even-better-errors": "^2.3.1",
//     "json5": "^2.2.3",
//     "jsonwebtoken": "^9.0.0",
//     "jwa": "^1.4.1",
//     "jws": "^3.2.2",
//     "kareem": "^2.3.2",
//     "kind-of": "^6.0.3",
//     "kleur": "^3.0.3",
//     "leven": "^3.1.0",
//     "levn": "^0.3.0",
//     "lines-and-columns": "^1.2.4",
//     "locate-path": "^5.0.0",
//     "lodash": "^4.17.21",
//     "lru-cache": "^5.1.1",
//     "magic-string": "^0.30.0",
//     "make-dir": "^3.1.0",
//     "makeerror": "^1.0.12",
//     "map-cache": "^0.2.2",
//     "map-visit": "^1.0.0",
//     "media-typer": "^0.3.0",
//     "memory-pager": "^1.5.0",
//     "merge-descriptors": "^1.0.1",
//     "merge-stream": "^2.0.0",
//     "methods": "^1.1.2",
//     "micromatch": "^4.0.5",
//     "mime": "^1.6.0",
//     "mime-db": "^1.52.0",
//     "mime-types": "^2.1.35",
//     "mimic-fn": "^2.1.0",
//     "minimatch": "^3.1.2",
//     "minimist": "^1.2.8",
//     "mixin-deep": "^1.3.2",
//     "mongodb": "^6.6.0",
//     "mongodb-connection-string-url": "^3.0.0",
//     "mongoose": "^5.13.22",
//     "mongoose-legacy-pluralize": "^1.0.2",
//     "mpath": "^0.8.4",
//     "mquery": "^3.2.5",
//     "ms": "^2.0.0",
//     "nanoid": "^3.3.6",
//     "nanomatch": "^1.2.13",
//     "natural-compare": "^1.4.0",
//     "negotiator": "^0.6.3",
//     "nice-try": "^1.0.5",
//     "node-int64": "^0.4.0",
//     "node-notifier": "^8.0.2",
//     "node-releases": "^2.0.10",
//     "normalize-package-data": "^2.5.0",
//     "normalize-path": "^3.0.0",
//     "npm-run-path": "^4.0.1",
//     "nwsapi": "^2.2.4",
//     "object-assign": "^4.1.1",
//     "object-copy": "^0.1.0",
//     "object-inspect": "^1.12.3",
//     "object-visit": "^1.0.1",
//     "object.pick": "^1.3.0",
//     "on-finished": "^2.4.1",
//     "once": "^1.4.0",
//     "onetime": "^5.1.2",
//     "optional-require": "^1.0.3",
//     "optionator": "^0.8.3",
//     "p-each-series": "^2.2.0",
//     "p-finally": "^1.0.0",
//     "p-limit": "^2.3.0",
//     "p-locate": "^4.1.0",
//     "p-try": "^2.2.0",
//     "parse-json": "^5.2.0",
//     "parse5": "^6.0.1",
//     "parseurl": "^1.3.3",
//     "pascalcase": "^0.1.1",
//     "path-exists": "^4.0.0",
//     "path-is-absolute": "^1.0.1",
//     "path-key": "^3.1.1",
//     "path-parse": "^1.0.7",
//     "path-to-regexp": "^0.1.7",
//     "picocolors": "^1.0.0",
//     "picomatch": "^2.3.1",
//     "pirates": "^4.0.5",
//     "pkg-dir": "^4.2.0",
//     "posix-character-classes": "^0.1.1",
//     "postcss": "^8.4.23",
//     "prelude-ls": "^1.1.2",
//     "pretty-format": "^26.6.2",
//     "process-nextick-args": "^2.0.1",
//     "prompts": "^2.4.2",
//     "proxy-addr": "^2.0.7",
//     "psl": "^1.9.0",
//     "pump": "^3.0.0",
//     "punycode": "^2.3.0",
//     "qs": "^6.11.0",
//     "querystringify": "^2.2.0",
//     "range-parser": "^1.2.1",
//     "raw-body": "^2.5.1",
//     "react-is": "^17.0.2",
//     "read-pkg": "^5.2.0",
//     "read-pkg-up": "^7.0.1",
//     "readable-stream": "^2.3.8",
//     "regex-not": "^1.0.2",
//     "regexp-clone": "^1.0.0",
//     "remove-trailing-separator": "^1.1.0",
//     "repeat-element": "^1.1.4",
//     "repeat-string": "^1.6.1",
//     "require-at": "^1.0.6",
//     "require-directory": "^2.1.1",
//     "require-main-filename": "^2.0.0",
//     "requires-port": "^1.0.0",
//     "resolve": "^1.22.2",
//     "resolve-cwd": "^3.0.0",
//     "resolve-from": "^5.0.0",
//     "resolve-url": "^0.2.1",
//     "ret": "^0.1.15",
//     "rimraf": "^3.0.2",
//     "rollup": "^2.77.3",
//     "rsvp": "^4.8.5",
//     "safe-buffer": "^5.2.1",
//     "safe-regex": "^1.1.0",
//     "safer-buffer": "^2.1.2",
//     "sane": "^4.1.0",
//     "saslprep": "^1.0.3",
//     "saxes": "^5.0.1",
//     "semver": "^6.3.0",
//     "send": "^0.18.0",
//     "serve-static": "^1.15.0",
//     "set-blocking": "^2.0.0",
//     "set-value": "^2.0.1",
//     "setprototypeof": "^1.2.0",
//     "shebang-command": "^2.0.0",
//     "shebang-regex": "^3.0.0",
//     "shellwords": "^0.1.1",
//     "side-channel": "^1.0.4",
//     "sift": "^13.5.2",
//     "signal-exit": "^3.0.7",
//     "sisteransi": "^1.0.5",
//     "slash": "^3.0.0",
//     "sliced": "^1.0.1",
//     "snapdragon": "^0.8.2",
//     "snapdragon-node": "^2.1.1",
//     "snapdragon-util": "^3.0.1",
//     "source-map": "^0.6.1",
//     "source-map-js": "^1.0.2",
//     "source-map-resolve": "^0.5.3",
//     "source-map-support": "^0.5.21",
//     "source-map-url": "^0.4.1",
//     "sparse-bitfield": "^3.0.3",
//     "spdx-correct": "^3.2.0",
//     "spdx-exceptions": "^2.3.0",
//     "spdx-expression-parse": "^3.0.1",
//     "spdx-license-ids": "^3.0.13",
//     "split-string": "^3.1.0",
//     "sprintf-js": "^1.0.3",
//     "stack-utils": "^2.0.6",
//     "static-extend": "^0.1.2",
//     "statuses": "^2.0.1",
//     "string_decoder": "^1.1.1",
//     "string-length": "^4.0.2",
//     "string-width": "^4.2.3",
//     "strip-ansi": "^6.0.1",
//     "strip-bom": "^4.0.0",
//     "strip-eof": "^1.0.0",
//     "strip-final-newline": "^2.0.0",
//     "superagent": "^8.0.9",
//     "supertest": "^6.3.3",
//     "supports-color": "^7.2.0",
//     "supports-hyperlinks": "^2.3.0",
//     "supports-preserve-symlinks-flag": "^1.0.0",
//     "symbol-tree": "^3.2.4",
//     "terminal-link": "^2.1.1",
//     "test-exclude": "^6.0.0",
//     "throat": "^5.0.0",
//     "tmpl": "^1.0.5",
//     "to-fast-properties": "^2.0.0",
//     "to-object-path": "^0.3.0",
//     "to-regex": "^3.0.2",
//     "to-regex-range": "^5.0.1",
//     "toidentifier": "^1.0.1",
//     "tough-cookie": "^4.1.2",
//     "tr46": "^2.1.0",
//     "type-check": "^0.3.2",
//     "type-detect": "^4.0.8",
//     "type-fest": "^0.21.3",
//     "type-is": "^1.6.18",
//     "typedarray-to-buffer": "^3.1.5",
//     "union-value": "^1.0.1",
//     "universalify": "^0.2.0",
//     "unpipe": "^1.0.0",
//     "unset-value": "^1.0.0",
//     "update-browserslist-db": "^1.0.11",
//     "urix": "^0.1.0",
//     "url-parse": "^1.5.10",
//     "use": "^3.1.1",
//     "util-deprecate": "^1.0.2",
//     "utils-merge": "^1.0.1",
//     "uuid": "^8.3.2",
//     "v8-to-istanbul": "^7.1.2",
//     "validate-npm-package-license": "^3.0.4",
//     "vary": "^1.1.2",
//     "vite": "^2.9.15",
//     "vue": "^3.3.2",
//     "w3c-hr-time": "^1.0.2",
//     "w3c-xmlserializer": "^2.0.0",
//     "walker": "^1.0.8",
//     "webidl-conversions": "^6.1.0",
//     "whatwg-encoding": "^1.0.5",
//     "whatwg-mimetype": "^2.3.0",
//     "whatwg-url": "^8.7.0",
//     "which": "^2.0.2",
//     "which-module": "^2.0.1",
//     "word-wrap": "^1.2.3",
//     "wrap-ansi": "^6.2.0",
//     "wrappy": "^1.0.2",
//     "write-file-atomic": "^3.0.3",
//     "ws": "^7.5.9",
//     "xml-name-validator": "^3.0.0",
//     "xmlchars": "^2.2.0",
//     "y18n": "^4.0.3",
//     "yallist": "^3.1.1",
//     "yargs": "^15.4.1",
//     "yargs-parser": "^18.1.3"
//   },
//   "scripts": {
//     "test": "echo \"Error: no test specified\" && exit 1"
//   },
//   "keywords": [],
//   "author": "",
//   "license": "ISC",
//   "description": ""
// }
