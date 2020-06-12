// pages/person/person.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    systemInfo: 'ios',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    leaveTimes: 0,
    leveData: 0,
    permanent: false
  },
  onShow() {
    this.updateUser()
  },
  flashUser() {
    if (app.globalData.user && app.globalData.user.time) {
      this.setData({
        leaveTimes: app.globalData.user.count,
        permanent: app.globalData.user.permanent,
        leveData: app.globalData.user.time < Date.now() ? '非会员' : new Date(app.globalData.user.time - 0).toISOString().slice(0, 10)
      })
    } else {
      this.updateUser()
    }
  },
  setPlat() {
    let that = this
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          systemInfo: res.platform,
        })
      }
    })
  },
  updateUser() {
    let that = this
    //获取当前用户信息
    wx.request({
      url: `https://www.zby888.cn/user?openId=${app.globalData.openId}`,
      success(e) {
        let d = e.data.data
        app.globalData.user = d.user
        that.flashUser()
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setPlat()
    if (app.globalData.hasUnionid && app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      this.flashUser()
    }    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  getUserInfo: function(e) {
    if (app.globalData.hasUnionid && e.detail.userInfo){
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      return
    }
    if (e.detail.userInfo) {
      wx.login({
        success: res => {
          let uniBody = {
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv,
            code: res.code
          }
          wx.request({
            url: `https://www.zby888.cn/binduid`,
            method: 'post',
            data: uniBody,
            success: (res) => {
              app.globalData.userInfo = e.detail.userInfo
              app.globalData.hasUnionid = true
              this.setData({
                userInfo: e.detail.userInfo,
                hasUserInfo: true
              })
            }
          })
        }
      })
      //用户按了允许授权按钮
    }
  }
})