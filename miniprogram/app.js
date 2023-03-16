const { checkUpdate } = require("./utils/update");
const { initWxCloud } = require("./utils/remote")

//初始化云函数
initWxCloud()

//检查更新
checkUpdate()

// app.js
App({
  onLaunch: function () {
    

    this.globalData = {};
  }
});

