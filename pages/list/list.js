// pages/list/list.js
import api from '../../utils/api.js';
import utils from '../../utils/util.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    itemClass: 'img-item'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let itemClass = options.type==='backgroundImage'||options.type==='wallpaper'?'long-img-item ':'img-item'
    this.setData({
      listData: JSON.parse(options.imgarr),
      itemClass: itemClass
    })
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
  showMoreImg: function (e) {
    let ids = e.currentTarget.dataset.imgs;
    let imgs = utils.getImgs(ids);
    tt.setStorageSync("xilie", imgs);
    tt.navigateTo({
      url: '/pages/imagePanel/imagePanel?imgs=' + imgs
    });
  }
});