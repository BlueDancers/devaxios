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
  console.log(context);
  
  // 将Axios.prototype.request的this传递给context
  // bind(Axios.prototype.request, context)的目的是让axios默认及request方法
  var instance = bind(Axios.prototype.request, context)
  // var instance = context
  // 将Axios.prototype的原型链上的对象复制到instance上面
  utils.extend(instance, Axios.prototype)
  // utils.extend(instance, Axios.prototype, context)

  // 将拦截器,默认配置复制到instance(这里主要是拦截器操作)
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
