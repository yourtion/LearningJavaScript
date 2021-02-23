class TestClass {
  constructor(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
  }

  f1(p3) {
    this.p1 = p3;
  }
}

module.exports = TestClass;
