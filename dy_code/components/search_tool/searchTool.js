// components/search_tool/searchTool.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    inputValue: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    listenerSearchInput: function (e) {
      this.setData({
        inputValue: e.detail.value
      })
    },
    gotoSearch: function (value) {
      let replaceValue = value.replace(/\s+/g, "");
      if (replaceValue.length > 0) {
        tt.navigateTo({
          url: `/pages/search/search?searchValue=${replaceValue}`
        });
      } else {
        tt.showToast({
          title: '搜索词不能为空~',
          icon: 'none',
          duration: 1000
        })
      }
    },
    _gotoSearch: function () {
      this.triggerEvent('gotoSearch');
    },
    confirmSearch(e) {
      let value = e.detail.value;
      this.gotoSearch(value)
    },
    search() {
      let value = this.data.inputValue;
      this.gotoSearch(value)
    }
  }
});