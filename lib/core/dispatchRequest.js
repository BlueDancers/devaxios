'use strict'

var utils = require('./../utils')
var transformData = require('./transformData')
var isCancel = require('../cancel/isCancel')
var defaults = require('../defaults')
var isAbsoluteURL = require('./../helpers/isAbsoluteURL')
var combineURLs = require('./../helpers/combineURLs')

/**
 * 如果已经请求取消，则抛出“取消”。
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }
}

/**
 * 使用配置的服务器将配置发配到服务器
 *
 * @param {object} config 用于请求的配置
 * @returns {Promise} The Promise 执行 fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config)
  console.log(isAbsoluteURL(config.url));
  
  // 支持baseURL设置  isAbsoluteURL(config.url) 判断url链接是否是绝对路径 如果是绝对路径 返回true
  //  不是很了解baseURL,将baseURL与url进行拼接
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url)
  }
  console.log(config);
  
  // 确保headers肯定存在,感觉没必要的判断,因为header是在初始化的时候给的,不会出现headers不存在的情况
  config.headers = config.headers || {}
  console.log(config);
  
  // 转换请求数据
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  )
    console.log(config);
    
  // 展平标题
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers || {}
  )

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method]
    }
  )

  var adapter = config.adapter || defaults.adapter

  return adapter(config).then(
    function onAdapterResolution(response) {
      throwIfCancellationRequested(config)

      // Transform response data
      response.data = transformData(
        response.data,
        response.headers,
        config.transformResponse
      )

      return response
    },
    function onAdapterRejection(reason) {
      if (!isCancel(reason)) {
        throwIfCancellationRequested(config)
        // Transform response data
        if (reason && reason.response) {
          reason.response.data = transformData(
            reason.response.data,
            reason.response.headers,
            config.transformResponse
          )
        }
      }
      return Promise.reject(reason)
    }
  )
}
