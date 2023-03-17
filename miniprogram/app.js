const { checkUpdate } = require("./utils/update");
const { initWxCloud, post } = require("./utils/remote")
import { iconifySetup } from './utils/svgIcon'

//初始化图标服务
iconifySetup("https://icon.jiayupearl.shop")

//初始化云函数
initWxCloud()

//检查更新
checkUpdate()

// app.js
App({
  onLaunch: function () {
    this.getUserInfo()
  },

  getUserInfo: function () {
    post("user").then(res=>{
      this.globalData.openid = res.data.openid;
    })
  },

  globalData:{
    openid: null
  },

  
});

