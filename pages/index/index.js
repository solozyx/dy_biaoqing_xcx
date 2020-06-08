//index.js
//获取应用实例
import api from '../../utils/api.js';
import utils from '../../utils/util.js';
const app = getApp();
Page({
  data: {
    index: 1,
    userInfo: {},
    hasUserInfo: false,
    todayUpdate: [],
    recentUpdate: [],
    emoticon: [], // 表情包
    headPortrait: [],//头像
    backgroundImage: [],//背景图
    wallpaper: [],//壁纸
    allImgData: [],
    updateImg: 24,
    height: ''
  },
  //事件处理函数
  bindViewTap: function () {
    tt.navigateTo({
      url: '../logs/logs'
    });
  },
  onLoad: function () {
    this.getClassImg()
  },
  onReady: function () {
    var res = tt.getSystemInfoSync();
    console.log(res);
    this.setData({
      height: res.windowHeight + 'px'
    });
    tt.showLoading({
      title: 'loading'
    });
    this.searchTool = this.selectComponent('#searchTool');
    this.getAllImg();
  },
  showMoreDetail: function (e) {
    console.log(e);
    let imgArr = e.target.dataset.imgarr;
    let imgs = e.target.dataset.imgs;
    tt.setStorageSync("xilie", imgArr);
    tt.navigateTo({
      url: '/pages/imagePanel/imagePanel?imgs=' + imgs
    });
  },

  showMoreImg(e) {
    let imgarr = JSON.stringify(e.target.dataset.imgarr);
    tt.navigateTo({
      url: `/pages/list/list?imgarr=${imgarr}`
    });
  },
  /**
   * 获取近期更新
   */
  getAllImg: function () {
    api.get(api.SERVER_PATH + api.IMGS).then(res => {
      //tt.setStorageSync("all_img", res.data)
      this.setData({
        emoticon: res.data.filter(item => item.classify_id === 1),
        headPortrait: res.data.filter(item => item.classify_id === 2),
        backgroundImage: res.data.filter(item => item.classify_id === 3),
        wallpaper: res.data.filter(item => item.classify_id === 4),
        allImgData: res.data
      })
      tt.hideLoading();
    });
  },

  getClassImg() {
    api.get(api.SERVER_PATH + api.CLASSIFY).then(res => {
      tt.hideLoading();
      this.setData({
        allData: res.data
      });
      console.log(this.data.allData);
    });
  },

  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () { },
  onPullDownRefresh: function () { },
  onReachBottom: function () {
    console.log('下拉刷新')
    let allImgData = this.data.allImgData;
    console.log(this.data.recentUpdate);
    console.log(allImgData.slice(this.data.updateImg, this.data.updateImg + 20));
    if (this.data.updateImg + 20 > allImgData.length) return;
    this.setData({
      recentUpdate: this.data.recentUpdate.concat(allImgData.slice(this.data.updateImg, this.data.updateImg + 20)),
      updateImg: this.data.updateImg + 20
    });
  },
  openSearch: function () {
    this.searchTool.gotoSearch();
  }
});