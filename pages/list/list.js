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
    api.get(api.SERVER_PATH + api.CLASSIFY).then(res => {
      let classifyArr = res.data.map(item => item.classify_id)
      console.log(classifyArr)
      let isLongType = JSON.parse(options.imgarr)[0].classify_id === classifyArr[2] || JSON.parse(options.imgarr)[0].classify_id === classifyArr[3]
      console.log(isLongType)
      let itemClass = isLongType ? 'long-img-item ' : 'img-item'
      this.setData({
        listData: JSON.parse(options.imgarr),
        itemClass: itemClass
      })
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
    tt.navigateTo({
      url: '/pages/imagePanel/imagePanel?imgItem=' + imgItem
    });
  }
});