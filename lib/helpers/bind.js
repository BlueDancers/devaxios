'use strict'

/**
 *
 *
 * @param {function} fn Axios.prototype.request promise对象
 * @param {Object} new Axios('默认配置')
 * @returns {function}
 */
module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length)
    console.log(args)

    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i]
    }
    // 将[empty](不清楚是什么)参数转为数组
    // 最后也就是config的数据传递给 Axios.prototype.request(config)
    return fn.apply(thisArg, args)
  }
}
