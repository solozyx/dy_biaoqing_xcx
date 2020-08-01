// pages/appreciate/appreciate.js
Page({
  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

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
    var route=getCurrentPages()
    var len=route.length
    var now_route='/'+route[len-1].__route__

    if(tt.wechat_user_id){
      //扫码进来的，直接用二维码中
      var promote_user_id=tt.wechat_user_id
    }else{
      //非扫码进入，从登录的资料中获取
       var promote_user_id=tt.userinfo.user_id
    }
    var path=`${now_route}?promote_user_id=${promote_user_id}`
    console.log('分享出去的连接为：',path)
   
    return {
      title: '',
      path,
      success: function (res) {// 转发成功
      },
      fail: function (res) {// 转发失败
      }
    };
  },
});