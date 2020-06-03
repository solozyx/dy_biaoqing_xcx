// components/search_tool/searchTool.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    gotoSearch: function () {
      tt.navigateTo({
        url: '/pages/search/search'
      });
    },
    _gotoSearch: function () {
      this.triggerEvent('gotoSearch');
    }
  }
});