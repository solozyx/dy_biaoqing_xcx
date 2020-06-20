// pages/collect/collect.js
import api from '../../utils/api.js';
import util from '../../utils/util.js';

const app = getApp();
let videoAd = null
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
    if(options)
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-c4d40f7b02f5f9b7'
      })
      // 显示广告
      videoAd.onLoad(() => {})
      videoAd.onError((err) => {})
      videoAd.onClose(res => {
        if (res.isEnded) {
          // 给予奖励
          var data = new Date()
          let timestr = data.setHours(data.getHours() + 3)
          wx.setStorageSync("collectTime", timestr)
        }
      });
    }
    let that = this;
    if (wx.getStorageSync('userData')) {
      that.setData({
        userInfo: wx.getStorageSync('userData').userInfo,
        openId: wx.getStorageSync('userData').openId,
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
    let openId = wx.getStorageSync('userData').openId;
    let urls = this.data.collectData.map(item=>item.split("?")[0])
    wx.showActionSheet({
      itemList: ['发送给朋友', '取消收藏'],
      success: function (e) {
        switch (e.tapIndex) {
          case 0:
            var dataStr = new Date().getTime()
            if (wx.getStorageSync("collectTime") && wx.getStorageSync("collectTime") > dataStr) {
              wx.previewImage({
                current: url.split("?")[0],
                urls: urls
              });
            } else {
              wx.showModal({
                title: '温馨提示',
                content: '观看30s视频解锁下载图片~',
                success(res) {
                  if (res.confirm) {
                    if(videoAd){
                      videoAd
                      .show()
                      .then(() => {
                        console.log("广告显示成功");
                      })
                      .catch(err => {
                       // 可以手动加载一次
                        videoAd.load().then(() => {
                          console.log("手动加载成功");
                          // 加载成功后需要再显示广告
                          return videoAd.show();
                        });
                      });
                    }
                  } else if (res.cancel) {
                    console.log("cancel, cold");
                  }
                }
              })
            }
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
      if (wx.getStorageSync('userData')) {
        let openId = wx.getStorageSync('userData').openId;
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
    let obj = {}
    if (e.detail.userInfo){
      this.setData({
        userInfo: e.detail.userInfo
      })
      wx.login({
        success: res => {
          let nickname = e.detail.userInfo.nickName
          api.get(`${api.SERVER_PATH}wxlogin?code=${res.code}&nick_name=${nickname}`).then(res1=>{
            obj.openId = res1.data.openId
            obj.userInfo = e.detail.userInfo
            wx.setStorageSync('userData', obj)
            this.setData({
              openId:res1.data.openId,
              hasUserInfo: true
            })
            if (app.globalData.imgItemData) {
              wx.navigateTo({
                url: '/pages/imagePanel/imagePanel?imgItem=' + app.globalData.imgItemData
              });
              app.globalData.imgItemData = null
              return
            }
            this.getCollectImg() 
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