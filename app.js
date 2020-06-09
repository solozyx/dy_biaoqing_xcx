App({
  globalData: { userInfo: null },
  onLaunch: function () {
    this.login(this.getUserInfo)
  },
  login(cb) {
    tt.login({
      success(res) {
        console.log('login', res);
        cb(res.code)
      },
      fail(res) {
        console.log(`login调用失败`);
      }
    });
  },
  getUserInfo(code) {
    // 获取用户信息
    tt.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          tt.getUserInfo({
            withCredentials: true,
            success: res => {
              console.log(res)
              // 可以将 res 发送给后台解码出 unionId

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              this.getInfo(res, code)
            }
          })
        } else {
          tt.authorize({
            scope: 'scope.userInfo',
            success: res => {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              tt.getUserInfo({
                withCredentials: true,
                success: res => {
                  console.log(res)
                  // 可以将 res 发送给后台解码出 unionId
                  this.globalData.userInfo = res.userInfo
                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                  this.getInfo(res, code)

                }
              })
            }
          })
        }
      }
    });
  },
  getInfo(res, code) {
    tt.request({
      url: "https://dy.test97.com/weapp/login",
      data: {
        encryptedData: res.encryptedData,
        iv: res.iv,
        code
      },
      method: 'get',
      success: res1 => {
        this.globalData.userInfo = res1.data
        if (this.userInfoReadyCallback) {
          this.userInfoReadyCallback(res1.data)
        }
      },
      fail(res) {
        console.log(`request调用失败`);
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