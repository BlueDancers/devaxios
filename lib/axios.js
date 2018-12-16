'use strict'

var utils = require('./utils')
var bind = require('./helpers/bind')
var Axios = require('./core/Axios')
var mergeConfig = require('./core/mergeConfig')
var defaults = require('./defaults')

/**
 * 创建Axios实例
 *
 * @param {Object} defaultConfig实例的默认配置
 * @return {Axios} Axios的新实例
 */
function createInstance(defaultConfig) {
  // defaultConfig 为初始化配置
  var context = new Axios(defaultConfig)

  // 完成new Axios后 在原型上挂载了很多属性,以及初始化拦截器
  var instance = bind(Axios.prototype.request, context)
  var instance = context
  console.log(instance)

  // 将axios.prototype复制到实例
  utils.extend(instance, Axios.prototype, context)

  // 将上下文复制到实例
  utils.extend(instance, context)
  return instance
}

// 创建要导出的默认实例
// 当axios执行的时候 首先axios进行默认的初始化配置
var axios = createInstance(defaults)

// 公开Axios类以允许类继承
axios.Axios = Axios

// 工厂用于创建新实例
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig))
}

// 取消请求的一些方法
axios.Cancel = require('./cancel/Cancel')
axios.CancelToken = require('./cancel/CancelToken')
axios.isCancel = require('./cancel/isCancel')

// all/spread  处理并行
axios.all = function all(promises) {
  return Promise.all(promises)
}
axios.spread = require('./helpers/spread')

module.exports = axios

// 允许在TypeScript中使用默认导入语法
module.exports.default = axios
