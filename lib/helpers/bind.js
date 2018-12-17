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
    // 获取到axios(//...)里面的参数
    var args = new Array(arguments.length)
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i]
    }
    // 将[empty](不清楚是什么)参数转为数组
    // 最后也就是config的数据传递给 Axios.prototype.request(config)
    // 将fn的this传递给thisArg 例如将axios('www.baidu.com') 就会执行这个warp函数最后将参数交给fn也就是Axios.prototype.request
    return fn.apply(thisArg, args)
  }
}
