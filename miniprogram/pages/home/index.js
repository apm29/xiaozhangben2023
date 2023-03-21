const dayjs = require("dayjs");
const { post } = require("../../utils/remote")


// pages/home/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeId: null,
    subTypeId: null,
    month: dayjs().format("YYYY-MM"),
    details :[
      {
        _id: "bed2457864180888000dc7db3c5ef412",
        creator_openid: "oxfum5NbYycbK3T7saZ72bVDMmm8",
        amount: "256.88",
        date: "2023-03-20",
        remark: "一百超市",
        sub_type: 2,
        type: 1,
        created_time: { $date: "2023-03-20T07:17:28.742Z" },
      },
      {
        _id: "fc8e6465641808c6054b829b10f31409",
        creator_openid: "oxfum5NbYycbK3T7saZ72bVDMmm8",
        amount: "255.66",
        date: "2023-03-20",
        remark: "测试",
        sub_type: 2,
        type: 1,
        created_time: { $date: "2023-03-20T07:18:30.119Z" },
      },
      {
        _id: "93e4b6a0641828ce0558d6f943221af8",
        creator_openid: "oxfum5NbYycbK3T7saZ72bVDMmm8",
        amount: "258",
        date: "2023-03-20",
        remark: "谢谢小",
        sub_type: 8,
        type: 1,
        created_time: { $date: "2023-03-20T09:35:10.137Z" },
      },
      {
        _id: "d3702bb064190a110002e76c24f5e304",
        creator_openid: "oxfum5NbYycbK3T7saZ72bVDMmm8",
        amount: "235",
        date: "2023-02-21",
        remark: null,
        sub_type: 9,
        type: 1,
        created_time: { $date: "2023-03-21T01:36:17.665Z" },
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.setData({
      userInfo: getApp().globalData
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  handleAddDetail(e){
    console.log(e);
    post("detail","create",e.detail,{
      showSuccess: true
    })
  },

  handleTypeChange(e){
   
  }
})