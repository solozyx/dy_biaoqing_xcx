// pages/collect/collect.js
import api from '../../utils/api.js';
import util from '../../utils/util.js';

const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    collectData: [],
    hasUserInfo: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      });
    } else if (app.userInfoReadyCallback) {
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res,
          hasUserInfo: true
        })
      };
    } else {
      return false
    }
    console.log(666)
    this.getCollectImg()
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let collectImgObj = wx.getStorageSync("collect_img");

    if (collectImgObj) {
      let ids = collectImgObj.map(it => it.img_id);
      let imgs = util.getImgs(ids);
      this.setData({
        collectData: imgs
      });
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () { },
  openImg: function (e) {
    let url = e.target.dataset.url;
    var that = this;
    let img_id = util.getIds([url])[0];
    let openId = app.globalData.userInfo.openId;
    wx.showActionSheet({
      itemList: ['发送给朋友', '取消收藏'],
      success: function (e) {
        switch (e.tapIndex) {
          case 0:
            wx.previewImage({
              current: url,
              urls: [url]
            });
            break;

          case 1:
            api.delete(api.SERVER_PATH + api.COLLECT + `?user_id=${openId}&img_id=${img_id}`).then(res => {
              wx.showToast({
                title: '已取消收藏'
              });
              api.get(api.SERVER_PATH + api.COLLECT + `?user_id=${openId}`).then(res => {
                wx.setStorageSync("collect_img", res.data);
                let ids = res.data.map(it => it.img_id);
                let imgs = util.getImgs(ids);
                that.setData({
                  collectData: imgs
                });
              });
            });
        }
      }
    });
  },
  getCollectImg: function () {
    var that = this
    wx.showLoading({
      title: 'loading'
    });
    let collectImgObj = {};
    if (wx.getStorageSync("collect_img")) {
      collectImgObj = wx.getStorageSync("collect_img");
      wx.hideLoading();
      let ids = collectImgObj.map(it => it.img_id);
      let imgs = util.getImgs(ids);
      that.setData({
        collectData: imgs
      });
    } else {
      // let openId = app.globalData.userInfo.openId
      if (app.globalData.userInfo && app.globalData.userInfo.openId) {
        let openId = app.globalData.userInfo.openId;
        api.get(api.SERVER_PATH + api.COLLECT + `?user_id=${openId}`).then(res => {
          wx.setStorageSync("collect_img", res.data);
          collectImgObj = res.data;
          wx.hideLoading();
          let ids = collectImgObj.map(it => it.img_id);
          let imgs = util.getImgs(ids);
          that.setData({
            collectData: imgs
          });
        });
      }
    }
  },
  submitSign: function () {
    this.login(this.getUserInfo)
  },
  login(cb) {
    wx.login({
      success(res) {
        console.log('login', res);
        cb(res.code)
      },
      fail(res) {
        console.log(`login调用失败`);
      }
    });
  },
  getUserInfo(code) {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            withCredentials: true,
            success: res => {
              this.getInfo(res, code)
            }
          })
        } else {
          wx.authorize({
            scope: 'scope.userInfo',
            success: res => {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              wx.getUserInfo({
                withCredentials: true,
                success: res => {
                  this.getInfo(res, code)
                }
              })
            },
            fail: res => {
              wx.showModal({
                title: '温馨提示',
                content: '小主，登录小程序，需允许授权用户信息~',
                success(res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success(res) {
                        console.log(res.authSetting)
                      }
                    })
                  }
                }
              })
            }
          })
        }
      }
    });
  },
  getInfo(res, code) {
    wx.request({
      url: "https://dy.test97.com/weapp/login",
      data: {
        encryptedData: res.encryptedData,
        iv: res.iv,
        code
      },
      method: 'get',
      success: res1 => {
        this.setData({
          userInfo: res1.data,
          hasUserInfo: true
        })
        app.globalData.userInfo = res1.data
        this.getCollectImg()
      },
      fail(res) {
        console.log(`request调用失败`);
      }
    });
  },
});