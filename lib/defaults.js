'use strict'

var utils = require('./utils')
var normalizeHeaderName = require('./helpers/normalizeHeaderName')

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
}

function setContentTypeIfUnset(headers, value) {
  if (
    !utils.isUndefined(headers) &&
    utils.isUndefined(headers['Content-Type'])
  ) {
    headers['Content-Type'] = value
  }
}

function getDefaultAdapter() {
  var adapter
  // O只有Node.JS有一个`[process]变量，使用它判断当前使用环境
  if (
    typeof process !== 'undefined' &&
    Object.prototype.toString.call(process) === '[object process]'
  ) {
    // For node use HTTP adapter
    adapter = require('./adapters/http')
  } else if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = require('./adapters/xhr')
  }
  return adapter
}

var defaults = {
  adapter: getDefaultAdapter(), // node.js这使用http模块 web则使用xhr模块

  transformRequest: [
    function transformRequest(data, headers) {
      // 处理请求 这里还没有调用
      console.log(headers);
      normalizeHeaderName(headers, 'Accept') //判断有没有`Accept` 有这添加
      normalizeHeaderName(headers, 'Content-Type') // 判断有没有 `Content-Type` 有则添加
      console.log(headers);
      
      if (
        utils.isFormData(data) ||
        utils.isArrayBuffer(data) ||
        utils.isBuffer(data) ||
        utils.isStream(data) ||
        utils.isFile(data) ||
        utils.isBlob(data)
      ) {
        return data
      }
      if (utils.isArrayBufferView(data)) {
        return data.buffer
      }
      if (utils.isURLSearchParams(data)) {
        //如果是 URLSearchParams对象 属性写入不同的header头 下面同理
        setContentTypeIfUnset(
          headers,
          'application/x-www-form-urlencoded;charset=utf-8'
        )
        return data.toString()
      }
      if (utils.isObject(data)) {
        setContentTypeIfUnset(headers, 'application/json;charset=utf-8')
        return JSON.stringify(data)
      }
      return data
    }
  ],

  transformResponse: [
    function transformResponse(data) { 
      
      /*eslint no-param-reassign:0*/
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data)
        } catch (e) {
          /* Ignore */
        }
      }
      return data
    }
  ],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  // 验证请求状态 判断请求是否成功
  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300
  }
}

defaults.headers = {
  common: {
    Accept: 'application/json, text/plain, */*'
  }
}
// 初始化default属性
utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {}
})

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE)
})

module.exports = defaults
