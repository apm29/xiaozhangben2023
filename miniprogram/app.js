const { checkUpdate } = require("./utils/update");
const { initWxCloud, post } = require("./utils/remote")
const  { iconifySetup } = require('./utils/svg-icon')
const { store } = require("./store/app")
const { eventBus } = require("./utils/event-bus")
// const dayjs = require('dayjs')
// const LocalizedFormat = require('dayjs/plugin/localizedFormat.js')
// dayjs.extend(LocalizedFormat)
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
    post("user","query").then(res=>{
      this.globalData.openid = res.data.openid;
      this.store.setState({
        login: Boolean(res.data.openid),
        userInfo:{
          openid: res.data.openid,
          avatar_url: res.data.avatar_url,
          nickname: res.data.nickname
        }
      })
      eventBus.publish("userInfo")
    }).then(()=>{
      //获取账本
      return post("accountBook","query").then(res=>{
        this.store.setState({
          accountBooks: res.data,
          selectedBook: res.data && res.data.length && res.data[0]
        })
        eventBus.publish("accountBook")
      })
    })
  },

  globalData:{
    openid: null
  },

  store: store,
});

