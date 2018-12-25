'use strict';

var Cancel = require('./Cancel');

/**
 * " CancelToken "是一个可用于请求取消操作的对象。
 *
 * @class
 * @param {Function} 执行程序执行程序功能。

 */
function CancelToken(executor) {
  // 除了直接new CancelToken source方法也会走到这里
  /**
  * 判断execcutor是不是函数因为API里面有直接new的
  * 
  */
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  
  // token里面现在有一个promise属性 但是未成功
  
  executor(function cancel(message) {
    // 这里的好像是为了防止data里面重复传值
    if (token.reason) {
      // 已经请求取消,将不会执行这个方法
      return;
    }
    
    token.reason = new Cancel(message);
    // resolve执行
    // resolvePromise(token.reason);
  });
   // 这个cancel函数就是 上面函数中的cancel，也就是source.cancel；
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * 返回一个包含新的`CancelToken`的对象和一个被调用的函数
 * 取消`CancelToken`。
 */
CancelToken.source = function source() {
  var cancel;
  // 这里有点难看懂
  /**
   * 1. 根据官方的API 首先执行这个方法
   * 2. 这里new CancelToken() 所以看上面的代码
   * 3. 将会的得到 CancelToken.executor里面的`cancel`方法 
   */
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;
