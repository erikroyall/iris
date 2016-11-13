const libs = {};

function extend(o, arr) {
  arr.forEach(function (lib) {
    let libO = require(lib);
    Object.keys(libO).forEach(function (key) {
      o[key] = libO[key];
    });
  });
}

extend(libs, [
  "./ds/array",
  "./ds/string",
  "./ds/table",

  "./io/console",
  "./io/file",
  "./io/net",

  "./util/math",
  "./util/crypto.js",
  "./util/os.js",
  "./util/time.js",
  "./util/unix.js",
  "./util/zlib.js",
  "./util/misc.js"
  ]);

module.exports = libs;
