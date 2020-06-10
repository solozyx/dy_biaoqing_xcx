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
    collectData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    tt.showLoading({
      title: 'loading'
    });

    if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo
      });
    } else {
      tt.getUserInfo({
        success(res) {
          that.setData({
            userInfo: res.userInfo
          });
        }

      });
    }

    let collectImgObj = {};

    if (tt.getStorageSync("collect_img")) {
      collectImgObj = tt.getStorageSync("collect_img");
      tt.hideLoading();
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
          tt.setStorageSync("collect_img", res.data);
          collectImgObj = res.data;
          tt.hideLoading();
          let ids = collectImgObj.map(it => it.img_id);
          let imgs = util.getImgs(ids);
          that.setData({
            collectData: imgs
          });
        });
      } else {
        // qcloud.request({
        //   url: api.SERVER_PATH + api.USER,
        //   login: true,

        //   success(res) {
        //     api.get(api.SERVER_PATH + api.COLLECT + `/${res.data.data.openId}`).then(res => {
        //       tt.setStorageSync("collect_img", res.data);
        //       collectImgObj = res.data;
        //       tt.hideLoading();
        //       let ids = collectImgObj.map(it => it.img_id);
        //       let imgs = util.getImgs(ids);
        //       that.setData({
        //         collectData: imgs
        //       });
        //     });
        //   }

        // });
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let collectImgObj = tt.getStorageSync("collect_img");

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
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  openImg: function (e) {
    let url = e.target.dataset.url;
    var that = this;
    let img_id = util.getIds([url])[0];
    let openId = app.globalData.userInfo.openId;
    tt.showActionSheet({
      itemList: ['发送给朋友', '取消收藏'],
      success: function (e) {
        switch (e.tapIndex) {
          case 0:
            tt.previewImage({
              current: url,
              urls: [url]
            });
            break;

          case 1:
            api.delete(api.SERVER_PATH + api.COLLECT + `?user_id=${openId}&img_id=${img_id}`).then(res => {
              tt.showToast({
                title: '已取消收藏'
              });
              api.get(api.SERVER_PATH + api.COLLECT + `?user_id=${openId}`).then(res => {
                tt.setStorageSync("collect_img", res.data);
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
  }
});