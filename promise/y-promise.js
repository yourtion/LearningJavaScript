const PENDING = Symbol('pending');
const FULFILLED = Symbol('fulfilled');
const REJECERD = Symbol('reject');

function INTERNAL() {}

function isFunction(func) {
  return typeof func === 'function';
}

function isObject(obj) {
  return typeof obj === 'object';
}

function isArray(arr) {
  return Array.isArray(arr);
}

function getThen(promise) {
  const then = promise && promise.then;
  if (promise && (isObject(promise) || isFunction(promise)) && isFunction(then)) {
    // 如果 then 是函数，将 promise 作为函数的 this 进行调用
    return function applyThen() {
      then.apply(promise, arguments);
    };
  }
}

function QueueItem(promise, onFulfilled, onRejected) {
  this.promise = promise;
  if (isFunction(onFulfilled)) {
    this.callFulfilled = function(value) {
      unwrap(this.promise, onFulfilled, value);
    };
  } else {
    this.callFulfilled = function(value) {
      doResolve(this.promise, value);
    };
  }
  if (isFunction(onRejected)) {
    this.callRejected = function(error) {
      unwrap(this.promise, onRejected, error);
    };
  } else {
    this.callRejected = function(error) {
      doReject(this.promise, error);
    };
  }
}

// 解包，使用父 promise 的结果设置当前 promise 的状态和值
function unwrap(promise, func, value) {
  // 保证异步执行
  process.nextTick(function() {
    let returnValue;
    try {
      returnValue = func(value);
    } catch (error) {
      return doReject(promise, error);
    }
    if (returnValue === promise) {
      // 返回值不能是 promise 本身，否则会死循环
      doReject(promise, new TypeError('Cannot resolve promise with itself'));
    } else {
      doResolve(promise, returnValue);
    }
  });
}

function YPromise(resolver) {
  if (!isFunction(resolver)) throw new TypeError('resolver must be a function');
  this.status = PENDING;
  this.value = undefined;
  this.queue = [];
  if (resolver !== INTERNAL) {
    safelyResolveThen(this, resolver);
  }
}

YPromise.prototype.then = function(onFulfilled, onRejected) {
  if (
    (!isFunction(onFulfilled) && this.status === FULFILLED) ||
    (!isFunction(onRejected) && this.status === REJECERD)
  ) {
    // 实现值穿透（如果传入的不是函数则忽略该值）
    return this;
  }
  // 内部的 promise
  const promise = new this.constructor(INTERNAL);
  if (this.status !== PENDING) {
    const resolver = this.status === FULFILLED ? onFulfilled : onRejected;
    unwrap(promise, resolver, this.value);
  } else {
    this.queue.push(new QueueItem(promise, onFulfilled, onRejected));
  }
  return promise;
};

YPromise.prototype.catch = function(onRejected) {
  return this.then(null, onRejected);
};

// 安全地执行 then
function safelyResolveThen(self, then) {
  // 控制只执行一次
  let called = false;
  // 捕获函数内抛出的异常
  try {
    then(
      function(value) {
        if (called) return;
        called = true;
        doResolve(self, value);
      },
      function(error) {
        if (called) return;
        called = true;
        doReject(self, error);
      }
    );
  } catch (err) {
    if (called) return;
    called = true;
    doReject(self, err);
  }
}

function doResolve(self, value) {
  try {
    // 不断解包 promise 直到返回值非 promise 对象
    const then = getThen(value);
    if (then) {
      safelyResolveThen(self, then);
    } else {
      // 设置 promise 的状态 FULFILLED 和值 value
      self.status = FULFILLED;
      self.value = value;
      // 设置子 promise 的状态 FULFILLED 和值 value
      self.queue.forEach(item => item.callFulfilled(value));
    }
    return self;
  } catch (error) {
    return doReject(self, error);
  }
}

function doReject(self, error) {
  // 设置 promise 的状态 REJECERD 和值 error
  self.status = REJECERD;
  self.value = error;
  // 设置子 promise 的状态 REJECERD 和值 error
  self.queue.forEach(item => item.callRejected(error));
  return self;
}

YPromise.resolve = resolve;
function resolve(value) {
  if (value instanceof this) {
    return value;
  }
  return doResolve(new this(INTERNAL), value);
}

YPromise.reject = reject;
function reject(reason) {
  return doReject(new this(INTERNAL), reason);
}

// YPromise.all = function() {};
// YPromise.race = function() {};

module.exports = YPromise;
