const { checkUpdate } = require("./utils/update");
const { initWxCloud, post } = require("./utils/remote")

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

  setWatcher: function(data,watch){
    Object.keys(watch).forEach(v=>{
      this.observe(data,v,watch[v])
    })
  },
  observe: function(obj,key,watchFn){
    let val = obj[key];
    Object.defineProperty(obj,key,{
      configurable: true,
      enumerable: true,
      set: function(value) {
          val = value;
          watchFn(value,val); // 赋值(set)时，调用对应函数
      },
      get: function() {
          return val;
      }
    })
  }
});

