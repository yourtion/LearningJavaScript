const { exec } = require('../utils');

const assert = require('assert');

exec(() => {
  // 存在符合的
  assert.doesNotMatch('I will fail', /fail/);
});

exec(() => {
  // 类型不一致
  assert.doesNotMatch(123, /pass/);
});

exec(() => {
  // 正确
  assert.doesNotMatch('I will pass', /different/);
  console.log('ok');
});

exec(() => {
  // 没有错误
  assert.ifError(null);
  console.log('ok');
});

exec(() => {
  assert.ifError('错误');
});

exec(() => {
  let err;
  (function errorFrame() {
    err = new Error('测试错误');
  })();

  (function ifErrorFrame() {
    assert.ifError(err);
  })();
});

exec(() => {
  assert.match('I will fail', /pass/);
});

exec(() => {
  assert.match(123, /pass/);
});

exec(() => {
  assert.match('I will pass', /pass/);
  console.log('ok');
});
