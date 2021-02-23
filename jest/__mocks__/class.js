const mockF1 = jest.fn();

const mock = jest.fn().mockImplementation(() => {
  return { f1: mockF1 };
})

module.exports = mock;
