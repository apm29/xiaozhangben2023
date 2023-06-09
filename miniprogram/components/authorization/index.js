const { watch } = require("../../utils/watch")

const app = getApp()
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
    
    this.setData({
      login: !!getApp().globalData.openid
    })
    watch(getApp().globalData, {
      openid:  (openid)=> {
        this.setData({
          login: !!openid
        })
      }
    })
  },




})