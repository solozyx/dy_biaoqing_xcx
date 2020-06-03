// pages/imagePanel/imagePanel.js
import api from '../../utils/api.js';
import utils from '../../utils/util.js';

var qcloud = require('../../vendor/wafer2-client-sdk/index');

const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    selectUrl: '',
    isCollect: false,
    imgData: [],
    openId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let imgs = options.imgs;

    if (app.globalData.userInfo && app.globalData.userInfo.openId) {
      this.setData({
        openId: app.globalData.userInfo.openId
      });
    } else {
      qcloud.request({
        url: api.SERVER_PATH + api.USER,
        login: true,

        success(res) {
          this.setData({
            openId: res.data.data.openId
          });
          api.get(api.SERVER_PATH + api.COLLECT + `/${res.data.data.openId}`).then(res => {
            tt.setStorageSync("collect_img", res.data);
          });
        }

      });
    }

    if (tt.getStorageSync("xilie")) {
      let imgs = tt.getStorageSync("xilie");
      this.isCollect(utils.getIds(imgs[0])[0], isc => {
        this.setData({
          isCollect: isc
        });
      });
      this.setData({
        imgData: imgs,
        selectUrl: imgs[0]
      });
    } else {
      api.get(api.SERVER_PATH + api.IMGS).then(res => {
        res.data.forEach(it => {
          it.imgUrl = `http://qcloudtest-1256295337.file.myqcloud.com${it.imgUrl.slice(47)}`;
        });
        this.setData({
          imgData: utils.getImgsdir(imgs, res.data)
        });
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

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
  onShareAppMessage: function (res) {
    return {
      title: '',
      path: `/pages/imagePanel/imagePanel?imgs=${this.imgs}`,
      success: function (res) {// 转发成功
      },
      fail: function (res) {// 转发失败
      }
    };
  },

  /**
   * 选中图片
   */
  selectImg(e) {
    let url = e.target.dataset.url;
    this.setData({
      selectUrl: url
    });
    this.isCollect(utils.getIds(url)[0], isc => {
      this.setData({
        isCollect: isc
      });
    });
  },

  /**
   * 预览图片
   */
  previewImage: function () {
    var urls = [];
    this.data.imgData.map(item => {
      urls.push(item);
    });
    tt.previewImage({
      current: this.data.selectUrl,
      urls: urls
    });
  },
  shareImage: function () {
    var that = this;
    tt.getStorage({
      key: 'isSet',
      success: function (res) {
        that.previewImage();
      },
      fail: function (res) {
        tt.showModal({
          title: "温馨提示",
          content: "请在预览界面长按图片，然后选择【发送给朋友】即可",
          showCancel: false,
          confirmText: "我知道了",
          success: function (res) {
            if (res.confirm) {
              tt.setStorage({
                key: 'isSet',
                data: true
              });
              that.previewImage();
            } else if (res.cancel) {
              console.log('用户点击取消');
            }
          }
        });
      }
    });
  },
  collectImg: function (e) {
    tt.showLoading({
      title: 'loading'
    });
    let openId = this.data.openId;
    let obj = {};
    obj.user_id = openId;
    obj.img_id = utils.getIds([this.data.selectUrl])[0];

    if (this.data.isCollect) {
      api.delete(api.SERVER_PATH + api.COLLECT + `/${openId}`, {
        img_id: obj.img_id
      }).then(res => {
        tt.showToast({
          title: '已取消收藏'
        });
        this.setData({
          isCollect: false
        });
        api.get(api.SERVER_PATH + api.COLLECT + `/${openId}`).then(res => {
          tt.setStorageSync("collect_img", res.data);
        });
      });
    } else {
      api.post(api.SERVER_PATH + api.COLLECT, obj).then(res => {
        tt.showToast({
          title: '成功收藏'
        });
        this.setData({
          isCollect: true
        });
        console.log(res.data == "success");

        if (res.data == "success") {
          api.get(api.SERVER_PATH + api.COLLECT + `/${openId}`).then(res => {
            tt.setStorageSync("collect_img", res.data);
          });
        }
      });
    }
  },
  isCollect: function (id, callback) {
    let collectImg = tt.getStorageSync('collect_img');
    callback(collectImg.findIndex(it => id == it.img_id) > -1);
  },
  gotozs: function () {
    let url = "http://www.moepan.net/uploads/2018032518452733765063.jpg";
    tt.previewImage({
      current: url,
      urls: [url]
    });
  }
});