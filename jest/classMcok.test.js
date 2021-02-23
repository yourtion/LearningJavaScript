it('没有 mock', () => {
  const TestClass = require('./class');
  const c = new TestClass(0, 1);
  expect(c.p1).toBe(0);
  // 通过 f1 改变 p1
  c.f1(2);
  expect(c.p1).toBe(2);
});

it('自动mock类所在的模块', () => {
  jest.mock('./class');
  const TestClass = require('./class');
  const c = new TestClass(0, 1);
  // 不存在 p1
  expect(c.p1).toBeUndefined();
  // 通过 f1 没有改变 p1
  c.f1(2);
  expect(c.f1.mock.calls.length).toBe(1);
  expect(c.p1).toBeUndefined();
});
