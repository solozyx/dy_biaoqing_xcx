// pages/imagePanel/imagePanel.js
import api from '../../utils/api.js';
import utils from '../../utils/util.js';


const app = getApp();
let videoAd = null
Page({
  /**
   * 页面的初始数据
   */
  data: {
    selectUrl: '',
    isCollect: false,
    imgData: [],
    openId: null,
    percent_n: 0,
    imgItem:null,
    is_active:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-eecdea2454006b83'
      })
      // 显示广告
      videoAd.onLoad(() => {})
      videoAd.onError((err) => {})
      videoAd.onClose(res => {
        if (res.isEnded) {
          // 给予奖励
          var data = new Date()
          let timestr = data.setHours(data.getHours() + 3)
          wx.setStorageSync("collectTime", timestr)
        }
      });
    }
    this.setData({
      imgItem:options.imgItem
    })
    let imgItem = JSON.parse(options.imgItem)
    imgItem.img = `${imgItem.img}?imageView2/q/30`
    this.setData({
      selectUrl: imgItem.img
    })
    if (wx.getStorageSync('userData')) {
      this.setData({
        openId: wx.getStorageSync('userData').openId
      })
      this.getCollectImg(imgItem.img_id, wx.getStorageSync('userData').openId)
    } else if (app.userInfoReadyCallback) {
      app.userInfoReadyCallback = res => {
        this.setData({
          openId: res.openId
        })
        this.getCollectImg(imgItem.img_id, res.openId)
      };
    }
    if (imgItem.series_id) {
      api.get(api.SERVER_PATH + api.IMGS + `?series_id=${imgItem.series_id}`).then(res => {
        console.log(res)
        this.setData({
          imgData: res.data.map(item => `${item.img}?imageView2/q/30`)
        })
      });
    } else {
      this.setData({
        imgData: [imgItem.img]
      })
    }
    console.log(imgItem)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    console.log(options)
   },

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
  onShareAppMessage: function (res) {
    let imgItem = this.data.imgItem
    console.log(imgItem)
    return {
      title: '',
      path: `/pages/imagePanel/imagePanel?imgItem=${imgItem}`,
      success: function (res) {// 转发成功
      },
      fail: function (res) {// 转发失败
      }
    };
  },

  getCollectImg(imgId, openId) {
    api.get(api.SERVER_PATH + api.COLLECT + `?user_id=${openId}`).then((res) => {
      wx.setStorageSync("collect_img", res.data)
      this.isCollect(imgId, isc => {
        this.setData({
          isCollect: isc
        });
      });
    })
  },

  /**
   * 选中图片
   */
  selectImg(e) {
    let url = e.target.dataset.url;
    this.setData({
      selectUrl: url
    });
    this.isCollect(utils.getIds(url)[0], isc => {
      this.setData({
        isCollect: isc
      });
    });
  },

  /**
   * 预览图片
   */
  previewImage: function (e) {
    let url = this.data.selectUrl.split("?")[0]
    let imgData = this.data.imgData.map(item=>item.split("?")[0])
    wx.previewImage({
      current: url,
      urls: imgData,
      success:res=>{
        console.log(res)
      },
      fail:res=>{
        console.log(res)
      },
      complete: res=>{
        console.log(res)
      }
    });
  },
  shareImage: function () {
    var that = this;
    wx.getStorage({
      key: 'isSet',
      success: function (res) {
        that.previewImage();
      },
      fail: function (res) {
        that.setData({
          is_active:true
        })
      }
    });
  },
  showPreview () {
    this.setData({
      is_active:false
    })
    wx.setStorage({
      key: 'isSet',
      data: true
    });
    this.previewImage()
  },
  collectImg: function (e) {
    if (!this.data.openId) {
      wx.showModal({
        title: '温馨提示',
        content: '小主,请先登录小程序，才可以下载图片~',
        success:res=> {
          if (res.confirm) {
            app.globalData.imgItemData = this.data.imgItem
            wx.switchTab({
              url: '/pages/collect/collect'
            });
          }
        }
      })
     return false
    }
    wx.showLoading({
      title: 'loading'
    });
    let openId = this.data.openId;
    let obj = {};
    obj.user_id = openId;
    obj.img_id = utils.getIds([this.data.selectUrl])[0];

    if (this.data.isCollect) {
      api.delete(api.SERVER_PATH + api.COLLECT + `?user_id=${openId}&img_id=${obj.img_id}`).then(res => {
        wx.showToast({
          title: '已取消收藏'
        });
        this.setData({
          isCollect: false
        });
        api.get(api.SERVER_PATH + api.COLLECT + `?user_id=${openId}`).then(res => {
          wx.setStorageSync("collect_img", res.data);
        });
      });
    } else {
      api.post(api.SERVER_PATH + api.COLLECT, obj).then(res => {
        wx.showToast({
          title: '成功收藏'
        });
        this.setData({
          isCollect: true
        });
        console.log(res.data == "success");

        if (res.data == "success") {
          api.get(api.SERVER_PATH + api.COLLECT + `?user_id=${openId}`).then(res => {
            wx.setStorageSync("collect_img", res.data);
          });
        }
      });
    }
  },
  isCollect: function (id, callback) {
    let collectImg = wx.getStorageSync('collect_img');
    callback(collectImg.findIndex(it => id == it.img_id) > -1);
  },
  gotozs: function () {
    let url = "http://www.moepan.net/uploads/2018032518452733765063.jpg";
    wx.previewImage({
      current: url,
      urls: [url]
    });
  },
  gotoHome: function () {
    /*配置了tabbar的只能使用switchtab */
    wx.switchTab({
      url: '/pages/index/index'
    });
  },
  beforeSave() {
    if (!wx.getStorageSync('userData')) {
      wx.showModal({
        title: '温馨提示',
        content: '小主,请先登录小程序，才可以下载图片~',
        success:res=> {
          if (res.confirm) {
            app.globalData.imgItemData = this.data.imgItem
            wx.switchTab({
              url: '/pages/collect/collect'
            });
          }
        }
      })
      return false
    }else{
    var dataStr = new Date().getTime()
    if (wx.getStorageSync("collectTime") && wx.getStorageSync("collectTime") > dataStr) {
      this.shareImage()
    } else {
      wx.showModal({
        title: '温馨提示',
        content: '观看30s视频解锁下载图片~',
        success(res) {
          if (res.confirm) {
            if(videoAd){
              videoAd
              .show()
              .then(() => {
                console.log("广告显示成功");
              })
              .catch(err => {
               // 可以手动加载一次
                videoAd.load().then(() => {
                  console.log("手动加载成功");
                  // 加载成功后需要再显示广告
                  return videoAd.show();
                });
              });
            }
          } else if (res.cancel) {
            console.log("cancel, cold");
          }
        }
      })
    }}
  },
  saveImgs() {
    let that = this
    let imgs = this.data.imgData
    var all_n = imgs.length
    wx.authorize({
      scope: 'scope.writePhotosAlbum',
      success() {
        wx.showToast(
          {
            title: '下载中...',
            icon: 'loading'
          }
        )
        for (let i = 0, j = 1; i < all_n; i++ , j++) {
          that.dow_temp(imgs[i], j, all_n, (text) => {
            if (text == 100) {
              wx.showLoading({
                title: j + '/' + all_n + '下载中',
                duration: 10000
              })
              if (j == all_n) {
                wx.showToast({
                  title: '下载完成',
                  duration: 1000
                })
              }
            } else {
              wx.showToast({
                title: '下载失败',
              })
            }
          })
        }
      },
      fail() {
        wx.showModal({
          title: '温馨提示',
          content: '小主，下载图片，需允许授权相册权限~',
          success(res) {
            if (res.confirm) {
              wx.openSetting({
                success(res) {
                  console.log(res.authSetting)
                }
              })
            }
          }
        })
      }
    })
  },
  dow_temp: function (str, i, all_n, callback) {
    var that = this;
    wx.authorize({
      scope: 'scope.writePhotosAlbum',
      success() {
        // 用户已经同意小程序使
        const downloadTask = wx.downloadFile({
          url: str,
          success: function (res) {
            var temp = res.tempFilePath
            wx.saveImageToPhotosAlbum({
              filePath: temp,
              success: function () { },
              fail: function () {
                wx.showToast({
                  title: '第' + i + '下载失败',
                })
              }
            })
          },
          fail: function (res) {
            wx.showToast({
              title: '下载失败',
            })
          }
        })

        downloadTask.onProgressUpdate((res) => {
          if (res.progress == 100) {
            callback(res.progress);
            var count = that.data.percent_n; //统计下载多少次了
            that.setData({
              percent_n: count + 1
            })
            if (that.data.percent_n == all_n) { //判断是否下载完成
              that.setData({ //完成后，清空percent-N,防止多次下载后，出错
                percent_n: 0
              })
            }
          }
        })

      },
      fail: function () {

      }
    })
  }
});