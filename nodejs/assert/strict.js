const { exec } = require('../utils');

exec(() => {
  const assert = require('assert').strict;
  // 在严格的断言模式中，对象的错误消息会显示差异
  assert.deepEqual([[[1, 2, 3]], 4, 5], [[[1, 2, '3']], 4, 5]);
})


exec(() => {
  const assert = require('assert');
  // 注意：这不会抛出 AssertionError！
  assert.deepEqual(/a/gi, new Date());
});

exec(() => {
  const assert = require('assert');

  // 生成 AssertionError 以便稍后比较错误的消息：
  const { message } = new assert.AssertionError({
    actual: 1,
    expected: 2,
    operator: 'strictEqual',
  });

  // 验证错误的输出：
  try {
    assert.strictEqual(1, 2);
  } catch (err) {
    console.error(err);
    assert(err instanceof assert.AssertionError);
    // 错误消息设置
    assert.strictEqual(err.message, message);
    assert.strictEqual(err.name, 'AssertionError');
    // 错误实例上的 actual 属性将包含此值
    assert.strictEqual(err.actual, 1);
    // 错误实例上的 expected 属性将包含此值
    assert.strictEqual(err.expected, 2);
    // 始终设置为字符串 ERR_ASSERTION 以表明错误实际上是断言错误
    assert.strictEqual(err.code, 'ERR_ASSERTION');
    // 设置为传入的运算符值
    assert.strictEqual(err.operator, 'strictEqual');
    // 表明消息是否是自动生成的
    assert.strictEqual(err.generatedMessage, true);
  }
})
