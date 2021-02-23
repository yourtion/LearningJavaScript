function forEach(items, callback) {
  for (const i of items) {
    callback(i);
  }
}

/**
 * 方法的 mock 非常简单，使用 jest.fn 就可以非常简单的mock一个函数。
 * https://facebook.github.io/jest/docs/en/mock-function-api.html
 */
test('Mock一个函数', () => {
  const mockCallback = jest.fn();

  forEach([0, 1], mockCallback);
  // 被调用两次
  expect(mockCallback.mock.calls.length).toBe(2);
  // 第一次返回 0
  expect(mockCallback.mock.calls[0][0]).toBe(0);
  // 第二次返回 1
  expect(mockCallback.mock.calls[1][0]).toBe(1);
});

/**
 * 可以使用 mock 注入返回值，可以使用的 api 为 mockReturnValue,mockReturnValueOnce 等。
 */
test('Mock返回值', () => {
  const myMock = jest.fn();

  myMock
    .mockReturnValueOnce(10)
    .mockReturnValueOnce('x')
    .mockReturnValue(true);

  // 第一次返回10
  const v1 = myMock();
  expect(v1).toBe(10);
  // 第二次返回 'x'
  const v2 = myMock();
  expect(v2).toBe('x');
  // 第三次后返回 true
  const v3 = myMock();
  expect(v3).toBe(true);
  const v4 = myMock();
  expect(v4).toBe(true);

  console.log(v1, v2, v3, v4);
});

/**
 * 使用jest.fn或者mockImplementationOnce 可以完全替换需要mock的函数。
 */
describe('Mock内部实现', () => {
  it('完全替换需要 mock 的函数', () => {
    const mockFn = jest.fn(cb => cb(null, true));

    mockFn((err, val) => {
      console.log(err, val);
      expect(err).toBeNull();
      expect(val).toBe(true);
    });
  });

  // 从其他模块创建的就可以使用mockImplementation
  it('mock 其他模块', () => {
    jest.mock('./foo');
    const foo = require('./foo');

    foo.mockImplementation(() => 'Yourtion');

    const val = foo();
    expect(val).toBe('Yourtion');
  });
});

it('Mock名字', () => {
  const myMockFn = jest.fn()
    .mockReturnValue('default')
    .mockImplementation(scalar => scalar + 42)
    .mockName('add42');
  expect(myMockFn(1)).toBe(43)
})
