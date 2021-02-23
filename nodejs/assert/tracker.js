const { exec } = require('../utils');

const assert = require('assert');

exec(()=>{
  const tracker = new assert.CallTracker();

  function func() {
    console.log("func calls")
  }

  // callsfunc() 必须在 tracker.verify() 之前执行 1 次
  const callsfunc = tracker.calls(func, 1);

  callsfunc();

  // 执行 tracker.verify() 并验证 tracker.calls() 方法已经被调用特定次数
  process.on('exit', () => {
    tracker.verify();
  });
});

exec(()=>{
  const tracker = new assert.CallTracker();

  function func() {}
  const callsfunc = tracker.calls(func, 2);
  callsfunc();
  // 返回一个包含 tracker.calls 包裹信息的数组
  console.error(tracker.report());
});

exec(()=>{
  const tracker = new assert.CallTracker();
  function func() {}
  const callsfunc = tracker.calls(func, 2);
  callsfunc();
  // Will throw an error since callsfunc() was only called once.
  tracker.verify();
})
