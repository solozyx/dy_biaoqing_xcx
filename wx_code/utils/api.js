'use strict';

import Promise from './es6-promise.min';
module.exports = {
  SERVER_PATH: 'https://testdy.test97.com/weapp/',
  // SERVER_PATH: 'https://www.d566.top/weapp/',/**https://650663973.esrabbit.xyz/weapp/ */
  CLASSIFY: 'classify',
  // 分类
  SERIES_ALL: 'seriesAll',
  // 所有系列
  SERIRS: 'series',
  // 分类下的系列classify_id
  HOT_SERIRS: 'hot/series',
  // 近期更新 取后四个为今日更新
  COLLECT: "collect",
  USER: "user",
  LOGIN: 'login',
  IMGS: 'imgs',

  get(url) {
    return new Promise((resolve, reject) => {
      console.log(url);
      wx.request({
        url: url,
        headers: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          resolve(res);
        },
        fail: function (res) {
          reject(res);
        }
      });
    });
  },

  post(url, data) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        data: data,
        method: 'POST',
        headers: {
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/x-www-form-urlencode;charset=UTF-8;'
        },
        success: function (res) {
          resolve(res);
        },
        fail: function (res) {
          reject(res);
        }
      });
    });
  },

  put(url, data) {
    return new Promise((resolve, reject) => {
      console.log(url);
      wx.request({
        url: url,
        data: data,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          resolve(res);
        },
        fail: function (res) {
          reject(res);
        }
      });
    });
  },

  delete(url, data) {
    return new Promise((resolve, reject) => {
      console.log(url);
      wx.request({
        url: url,
        data: data,
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          resolve(res);
        },
        fail: function (res) {
          reject(res);
        }
      });
    });
  },

  json2Form(json) {
    var str = [];

    for (var p in json) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
    }

    return str.join("&");
  }

};