// pages/search/search.js
import api from '../../utils/api.js';
import utils from '../../utils/util.js';
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    inputValue: "",
    searchData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      inputValue: options.searchValue
    });
    this.getSearch(options.searchValue);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },

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
  listenerSearchInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    });
  },
  clearValue: function () {
    this.setData({
      inputValue: ''
    });
  },

  confirmSearch(e) {
    console.log(e.detail.value);
    let value = e.detail.value;
    this.getSearch(value);
  },

  search() {
    this.getSearch(this.data.inputValue);
  },

  getSearch(value) {
    api.get(api.SERVER_PATH + api.IMGS + `?title=${value}`).then(res => {
      this.setData({
        searchData: res.data
      });
    });
  },

  showMoreImg: function (e) {
    let imgItem = JSON.stringify(e.target.dataset.item);
    wx.navigateTo({
      url: '/pages/imagePanel/imagePanel?imgItem=' + imgItem
    });
  }
});