'use strict';

/**
 * 确定指定的URL是否为绝对URL
 *
 * @param {string} url要测试的URL
 * @returns {boolean} 如果指定的URL是绝对的，则为True，否则为false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};
