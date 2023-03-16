function post(
  functionName,
  topic,
  payload, options
) {
  options = Object.assign({
      showLoading: true,
      showError: true,
      showSuccess: false,
    },
    options
  )
  if (options.showLoading) {
    wx.showLoading({
      title: '加载中..',
    });
  } else {
    wx.showNavigationBarLoading()
  }
  return requestCloud({
    functionName,
    topic,
    payload
  }).then(res => {
    if (options.showSuccess && res.result.success) {
      wx.showToast({
        title: res.result.msg || "成功",
      })
    }
    if (options.showError && !res.result.success) {
      wx.showToast({
        title: res.result.msg || "失败",
      })
    }
    return res;
  }).catch(err => {
    if (options.showError) {
      wx.showToast({
        title: err,
      })
    }
    throw err;
  }).finally(() => {
    if (options.showLoading) {
      wx.hideLoading()
    } else {
      wx.hideNavigationBarLoading()
    }

  })
}

function requestCloud({
  functionName,
  topic,
  payload
}) {
  return wx.cloud.callFunction({
    name: functionName,
    data: {
      topic,
      payload
    }
  })
}

function initWxCloud(){
  if (!wx.cloud) {
    console.error('请使用 2.2.3 或以上的基础库以使用云能力');
  } else {
    wx.cloud.init({
      // env 参数说明：
      //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
      //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
      //   如不填则使用默认环境（第一个创建的环境）
      env: 'cloud1-0gclysyt73d660e9',
      traceUser: true,
    });
  }
}

module.exports = {
  initWxCloud,
  post
}