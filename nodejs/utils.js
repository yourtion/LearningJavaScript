const fs = require('fs');
const { format } = require('util');
/**
 * 输出分割线
 * @param {String} keyword
 * @param {Number} times
 */
exports.seg = function (keyword = '', times = 30) {
  console.error('-'.repeat(times) + keyword + '-'.repeat(times));
};

/**
 * 执行方法并捕获打印错误（输出分割线）
 * @param {*} fn
 * @param {*} name
 */
exports.exec = function (fn, name = '') {
  if (name) {
    exports.seg(name);
  }
  try {
    fn();
  } catch (error) {
    console.log(error);
  }
  exports.seg(name);
};

/**
 * 同步输出日志
 * @param {String} msg
 */
exports.logSync = function (...msg) {
  fs.writeSync(process.stdout.fd, format(...msg) + '\n');
};
