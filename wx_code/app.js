//app.js
App({
  onLaunch: function() {
    let that = this
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success:res=>{
        if (res.code) {
         console.log(res)
         if(!wx.getStorageSync('userData')){
          this.getInfo(res.code)
         }
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })

  },
  getInfo(code){
        // 获取用户信息
        wx.getSetting({
          success: res => {
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              wx.getUserInfo({
                success: res => {
                  // 可以将 res 发送给后台解码出 unionId
                  wx.request({
                    url: "https://dy.test97.com/weapp/wxlogin",
                    data: {
                      nick_name: res.userInfo.nickName,
                      code
                    },
                    method: 'get',
                    success: res1 => {
                      let obj= {
                        openId:res1.data.openId,
                        userInfo:res.userInfo
                      }
                      wx.setStorageSync('userData', obj)
                      if (this.userInfoReadyCallback) {
                        this.userInfoReadyCallback(obj)
                      }
                    },
                    fail(res) {
                      console.log(`request调用失败`);
                    }
                  });                  
                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                }
              })
            }
          },
          fail: res=>{
            console.log(res)
          }
        })
  },
  globalData: {
    hasUnionid: null,
    userInfo: null,
    url: null,
    openId: null,
    user: null
  }
})