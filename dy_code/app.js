import apis from './utils/apis.js';

App({
  globalData: { imgItemData: null },

  //绑定微信
  bindWechat(data) {
    var that = this
    console.log('开始绑定微信：', data)
    apis.bindWechat(data).then(res => {
      console.log('绑定的结果为：', res)
      if (res.code == 200 && res.data != 4001) {
        tt.showToast({
          title: res.msg
        })
        //修改资料内部的数据
      }
      if (res.data == 4001) {
        tt.showModal({
          title: '提示',
          content: '该账号已经绑定过其他微信了，是否更换？',
          success: function (res) {
            if (res.confirm) {
              data.force = true
              that.bindWechat(data)
            } else if (res.cancel) {
              console.log('用户点击取消');
            }
          }
        });
      }
    })
  },

  //获取分销登录的用户信息
  getTtUserInfo() {
    apis.userinfo({ token: tt.token }).then(res => {
      var data = res.data.data
      tt.userinfo = data
      console.log('获取用户资料为：', data)
    })
  },

  //调用分销端的登录
  loginDistribution(code) {
    apis.login({ code: code }).then(res => {
      var data = res.data.data
      console.log('分销端的登录为', data)
      tt.token = data.token

      //登录成功之后，获取用户资料
      that.getTtUserInfo()
      try {
        //更新用户资料
        that.updateUserInfo()
      } catch (e) {

      }
      //判断微信是否绑定成功了
      if (tt.isBindWechat === false) {
        that.bindWechat({
          wechat_user_id: tt.wechat_user_id,
          token: tt.token
        })
      }

    }).catch(err => {
      console.log('错误')
    })
  },
  //更新用户资料
  updateUserInfo() {
    tt.getUserInfo({
      success: res => {
        // console.log('获取到的资料为', res.userInfo)
        var data = {
          ...res.userInfo,
          token: tt.token
        }
        apis.updateUserInfo(data).then(res => {
          console.log('资料更新', res.data.data)
        }).catch(err => {
          console.log('err', err)
        })
      }, fail: res => {
        console.log('获取资料失败')
      }
    })
  },



  //根据根据onLaunch中的参数，判断接下来需要执行的操作
  checkWxCode(e) {

    //将query存入全局变量
    tt.query = e.query

    var that = this
    console.log('e', e)

    //微信端的user_id  扫描二维码的id，用来绑定抖音和微信号的
    if (e && e.query && e.query.wechat_user_id && e.query.wechat_user_id != 0) {
      tt.wechat_user_id = e.query.wechat_user_id

      //登录成功了的话，直接绑定
      if (tt.token) {
        that.bindWechat({
          wechat_user_id: tt.wechat_user_id,
          token: tt.token
        })
      } else {
        //微信还未绑定
        tt.isBindWechat = false
      }
    }

    //推广者id(抖音链接里面的id，注意是user表中的id，不是tt_user表中的)，用来记录广告收益属于哪个微信号的
    if (e && e.query && e.query.promote_user_id && e.query.promote_user_id != 0) {
      var promote_user_id = e.query.promote_user_id
      tt.promote_user_id = promote_user_id
    }

  },


  onLaunch: function (e) {
    var that = this
    this.checkWxCode(e)
    this.login(this.getUserInfo)
  },

  login(cb) {
    tt.login({
      success:res=> {
        this.loginDistribution(res.code)
        if (!tt.getStorageSync('userData')) {
          cb(res.code)
        }
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
      url: "https://testdy.test97.com/weapp/login",
      data: {
        encryptedData: res.encryptedData,
        iv: res.iv,
        code
      },
      method: 'get',
      success: res1 => {
        tt.setStorageSync('userData', res1.data)
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