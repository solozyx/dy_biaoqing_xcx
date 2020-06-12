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
    let obj = {
      emoticon: '热门表情包', // 表情包
      headPortrait: '热门头像',//头像
      backgroundImage: '热门背景',//背景图
      wallpaper: '热门壁纸'
    }
    wx.setNavigationBarTitle({
      title: obj[options.type]
    })
    let isLongType = options.type==='wallpaper'
    console.log(isLongType)
    let itemClass = isLongType ? 'long-img-item ' : 'img-item'
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
  showMoreDetail: function (e) {
    let imgItem = JSON.stringify(e.target.dataset.item);
    wx.navigateTo({
      url: '/pages/imagePanel/imagePanel?imgItem=' + imgItem
    });
  }
});