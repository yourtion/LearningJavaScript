const YPromise = require('.');

exports.deferred = function deferred() {
  const pending = {};
  pending.promise = new YPromise(function(resolver, reject) {
    pending.resolve = resolver;
    pending.reject = reject;
  });
  return pending;
};
exports.resolved = function(value) {
  return YPromise.resolve(value);
};
exports.rejected = function(reason) {
  return YPromise.reject(reason);
};
