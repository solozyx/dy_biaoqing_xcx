App({
  globalData: { userInfo: null },
  onLaunch: function () {
    // 登录
    tt.login({
      success(res) {
        console.log(res)
        if (res.code) {
          // 登录获取openid
          // wx.request({
          //   url: `https://www.zby888.cn/login?code=${res.code}`,
          //   success(e) {
          //     let d = e.data.data
          //     let openid = d.openId
          //     that.globalData.openId = openid
          //     //获取当前用户信息
          //     wx.request({
          //       url: `https://www.zby888.cn/user?openId=${openid}`,
          //       success(e) {
          //         let d = e.data.data
          //         that.globalData.user = d.user
          //         if (d.user.unionid) {
          //           that.globalData.hasUnionid = true
          //         }
          //       }
          //     })
          //   }
          // })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
    // 获取用户信息
    tt.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          tt.getUserInfo({
            success: res => {
              console.log(res)
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        } else {
          tt.authorize({
            scope: 'scope.userInfo',
            success: res => {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              tt.getUserInfo({
                success: res => {
                  console.log(res)
                  // 可以将 res 发送给后台解码出 unionId
                  this.globalData.userInfo = res.userInfo
                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                  if (this.userInfoReadyCallback) {
                    this.userInfoReadyCallback(res)
                  }
                }
              })
            }
          })
        }
      }
    });
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  }
});