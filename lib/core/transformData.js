'use strict';

var utils = require('./../utils');

/**
 * 转换请求或响应的数据
 *
 * @param {Object|String} data 要转换的数据
 * @param {Array} headers 请求或响应的标头
 * @param {Array|Function} fns 单个函数或函数数组
 * @returns {*} 得到的转换数据
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  console.log(fns);
  
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};
