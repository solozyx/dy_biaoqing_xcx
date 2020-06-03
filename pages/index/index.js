//index.js
//获取应用实例
import api from '../../utils/api.js';
import utils from '../../utils/util.js';
const app = getApp();
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    todayUpdate: [],
    recentUpdate: [],
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
  onLoad: function () {},
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
    this.getRecnetUpdate();
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

  /**
   * 获取近期更新
   */
  getRecnetUpdate: function () {
    api.get(api.SERVER_PATH + api.IMGS).then(res => {
      res.data.forEach(it => {
        it.imgUrl = it.img    // `http://qcloudtest-1256295337.file.myqcloud.com${it.imgUrl.slice(47)}`;
      });
      tt.setStorageSync("all_img", res.data);
      api.get(api.SERVER_PATH + api.HOT_SERIRS).then(res => {
        tt.hideLoading();
        let allData = tt.getStorageSync('all_img');
        res.data.forEach(it => {
          it.imgArr = utils.getImgsdir(it.imgs, allData);
          it.url = utils.getImgsdir([it.img_id], allData)[0];
        });
        res.data = res.data.reverse();
        this.setData({
          allImgData: res.data,
          recentUpdate: res.data.slice(4, 24),
          todayUpdate: res.data.slice(0, 4)
        });
      });
    });
  },

  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {},
  onPullDownRefresh: function () {},
  lower: function (e) {
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
  },
  seekExpression: function () {
    tt.navigateTo({
      url: '/pages/seekExpression/seekExpression'
    });
  },
  playGame: function () {
    tt.navigateToMiniProgram({
      appId: 'wxec8f800476c3964a',
      path: 'index.html?channel=bqtcpc',

      success(res) {// 打开成功
      }

    });
  }
});