it('直接在单元测试里面 mock 模块', () => {
  jest.mock('fs', () => ({
    readFileSync: jest.fn().mockReturnValue('Yourtion'),
  }));
  const fs = require('fs');
  const content = fs.readFileSync('aaa').toString();
  expect(content).toBe('Yourtion');
});

describe('对于用户目录下面的模块', () => {
  // 注意：用这种方式， 需要在单元测试文件中需添加下面的代码才能使此mock生效。

  it('没有mock', () => {
    const lib = require('./lib');
    expect(lib()).toBe(777);
  });

  it('mock', () => {
    jest.mock('./lib');
    const lib = require('./lib');
    expect(lib()).toBe('mock');
  });
});
