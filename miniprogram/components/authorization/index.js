// components/authorization/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    login: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    login: function () {
      getApp().getUserInfo()
    }
  },

  attached: function () {
    const that = this
    that.setData({
      login: !!getApp().globalData.openid
    })
    getApp().setWatcher(getApp().globalData, {
      openid: function (openid) {
        that.setData({
          login: !!openid
        })
      }
    })
  },




})