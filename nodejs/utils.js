exports.seg = function (keyword = '', times = 30) {
  console.error('-'.repeat(times) + keyword + '-'.repeat(times));
};

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
