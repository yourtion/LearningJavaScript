const async_hooks = require('async_hooks');
const fs = require('fs');
const { nextTick } = require('process');

const { logSync } = require('../utils');

// https://zhuanlan.zhihu.com/p/53036228

// Return the ID of the current execution context.
const eid = async_hooks.executionAsyncId();

// Return the ID of the handle responsible for triggering the callback of the
// current execution scope to call.
const tid = async_hooks.triggerAsyncId();

logSync({ eid, tid });

// init is called during object construction. The resource may not have
// completed construction when this callback runs, therefore all fields of the
// resource referenced by "asyncId" may not have been populated.
function init(asyncId, type, triggerAsyncId, resource) {
  logSync('init', { asyncId, type, triggerAsyncId, resource });
}

// Before is called just before the resource's callback is called. It can be
// called 0-N times for handles (e.g. TCPWrap), and will be called exactly 1
// time for requests (e.g. FSReqCallback).
function before(asyncId) {
  logSync('before', { asyncId });
}

// After is called just after the resource's callback has finished.
function after(asyncId) {
  logSync('after', { asyncId });
}

// Destroy is called when the resource is destroyed.
function destroy(asyncId) {
  logSync('destroy', { asyncId });
}

// promiseResolve is called only for promise resources, when the
// `resolve` function passed to the `Promise` constructor is invoked
// (either directly or through other means of resolving a promise).
function promiseResolve(asyncId) {
  logSync('promiseResolve', { asyncId });
}

// Create a new AsyncHook instance. All of these callbacks are optional.
// hook 方法中不能使用 console.log，因为是异步的，会导致死循环，要用 fs.writeSync
const asyncHook = async_hooks.createHook({ init, before, after, destroy, promiseResolve });

// Allow callbacks of this AsyncHook instance to call. This is not an implicit
// action after running the constructor, and must be explicitly run to begin
// executing callbacks.
asyncHook.enable();

async function run() {
  nextTick(() => {
    logSync('run');
  });
}

run();

function run2(callback) {
  nextTick(() => {
    callback('run2');
  });
}
run2(logSync);

fs.readFile(__filename, (err, ret) => {
  logSync(err, ret);
});

asyncHook.disable();
