const { post } = require("../../utils/remote")

const app = getApp()

Page({
  data: {
    theme: wx.getSystemInfoSync().theme,
  },
  onLoad() {
    wx.onThemeChange((result) => {
      this.setData({
        theme: result.theme
      })
    })
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
    const userInfo = app.store.getState().userInfo
    wx.cloud.uploadFile({
      cloudPath: `${userInfo.openid}_AVATAR.jpg`,
      filePath: avatarUrl,
      success: (res)=>{
        app.store.setState({
          userInfo:{
            ...userInfo,
            avatar_url: res.fileID
          }
        })
        post("user","update",{
          avatar_url: res.fileID,
          nickname: userInfo.nickname
        })
      }
    })
    
   
  },
  onChangeNickname(e){
    const { value } = e.detail;
    const userInfo = app.store.getState().userInfo
    app.store.setState({
      userInfo:{
        ...userInfo,
        nickname: value
      }
    })
    post("user","update",{
      avatar_url: userInfo.avatarUrl,
      nickname: value
    })
  }
})
