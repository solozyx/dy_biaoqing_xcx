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
    openId:null,
    collectData: [],
    hasUserInfo: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if (app.globalData.userInfo && app.globalData.openId) {
      that.setData({
        userInfo: app.globalData.userInfo,
        openId: app.globalData.openId,
        hasUserInfo: true
      });
    } else if (app.userInfoReadyCallback) {
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo, 
          openId: res.openId,
          hasUserInfo: true
        })
      };
    } else {
      return false
    }
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
      console.log(imgs)
    } else {
      console.log(app)
      // let openId = app.globalData.userInfo.openId
      if (app.globalData.userInfo && app.globalData.openId) {
        let openId = app.globalData.openId;
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
  getUserInfo: function(e) {
    console.log(e)
    if (e.detail.userInfo){
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo
      })
      wx.login({
        success: res => {
          console.log(res)
          let nickname = e.detail.userInfo.nickName
          api.get(`${api.SERVER_PATH}wxlogin?code=${res.code}&nick_name=${nickname}`).then(res1=>{
            console.log(res1)
            app.globalData.openId = res1.data.openId
            this.getCollectImg() 
            this.setData({
              openId:res1.data.openId,
              hasUserInfo: true
            })
          })
        },
        fail: res=>{
          console.log(res)
        }
      })
    } else {
      //用户按了拒绝按钮
      wx.showToast({
        title: '小主，使用快兔表情，需允许微信授权~',
        icon: 'none',
        duration: 2000
      })
    }
  }
});