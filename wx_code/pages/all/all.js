// pages/all/all.js
import api from '../../utils/api.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    allData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.getStorage({
      key: 'all_img',
      success: function (res) {
        console.log(res);
      }
    });
    wx.showLoading({
      title: 'loading'
    });
    this.searchTool = this.selectComponent('#searchTool');
    this.getAll();
  },

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
  onShareAppMessage: function () {},
  openSearch: function () {
    this.searchTool.gotoSearch();
  },
  showMoreList: function (e) {
    let id = e.target.dataset.classify_id;
    wx.navigateTo({
      url: `/pages/list/list?id=${id}`
    });
  },
  getAll: function () {
    api.get(api.SERVER_PATH + api.CLASSIFY).then(res => {
      wx.hideLoading();
      this.setData({
        allData: res.data
      });
      console.log(this.data.allData);
    });
  }
});