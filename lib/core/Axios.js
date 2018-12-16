'use strict'

var utils = require('./../utils')
var buildURL = require('../helpers/buildURL')
var InterceptorManager = require('./InterceptorManager')
var dispatchRequest = require('./dispatchRequest')
var mergeConfig = require('./mergeConfig')

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  // eslint-disable-next-line no-console
  this.defaults = instanceConfig
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  }
  console.log(this.interceptors.request)
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // 方作者我我们提供axios('url',{})以及axios(config)两种写法
  if (typeof config === 'string') {
    config = arguments[1] || {}
    config.url = arguments[0]
  } else {
    config = config || {}
  }
  // 合并 defaultconfig与自定义的config
  config = mergeConfig(this.defaults, config)
  config.method = config.method ? config.method.toLowerCase() : 'get' // 默认没有都是get请求

  // 创造一个请求序列数组 第一位是发送请求的方法,第二位是空
  var chain = [dispatchRequest, undefined]
  var promise = Promise.resolve(config)
  // console.log(this.interceptors.request);
  //this.interceptors.request = InterceptorManager() 如果定义拦截器 那么 这里的InterceptorManager内部的handlers就会存在你写的拦截器代码
  // 执行InterceptorManager原型链上的forEach事件
  this.interceptors.request.forEach(function unshiftRequestInterceptors(
    interceptor
  ) {
    // interceptor 为 执行InterceptorManager原型链上的forEach事件返回的 拦截器函数
    //把请求拦截器数组依从加入头部
    chain.unshift(interceptor.fulfilled, interceptor.rejected)
  })

  this.interceptors.response.forEach(function pushResponseInterceptors(
    interceptor
  ) {
    // 同理
    // 将接收拦截器数组一次加入尾部
    chain.push(interceptor.fulfilled, interceptor.rejected)
  })

  while (chain.length) {
    // shift() 方法用于把数组的第一个元素从其中删除，并返回第一个元素的值。
    // 形成一个promise调用链条
    promise = promise.then(chain.shift(), chain.shift())
  }
  return promise
}

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config)
  return buildURL(config.url, config.params, config.paramsSerializer).replace(
    /^\?/,
    ''
  )
}

// 为支持的请求方法提供别名
utils.forEach(
  ['delete', 'get', 'head', 'options'],
  function forEachMethodNoData(method) {
    /*eslint func-names:0*/
    // 这里提供了语法通,在axios的原型链条上面 增加'delete', 'get', 'head', 'options'直接调用的方法 实际上还是request
    Axios.prototype[method] = function(url, config) {
      return this.request(
        utils.merge(config || {}, {
          method: method,
          url: url
        })
      )
    }
  }
)

// 与上方同理
utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(
      utils.merge(config || {}, {
        method: method,
        url: url,
        data: data
      })
    )
  }
})

module.exports = Axios
