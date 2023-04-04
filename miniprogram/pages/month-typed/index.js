const dayjs = require("dayjs").default;
const types = require("../../dict/types")
const {
  post
} = require("../../utils/remote");

// pages/month-typed/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: null,
    subType: null,
    month: null,
    data: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      type: options.type,
      subType: options.subType,
      month: options.month,
    });
    this.getMonthTypedDetails()
  },

  getMonthTypedDetails() {
    post("detail", "query-list", {
      page_size: 99999,
      type_id: this.data.type,
      sub_type_id: this.data.subType,
      month: this.data.month
    }).then(res => {
      console.log(res);
      this.setData({
        data: res.data.map((it) => ({
          ...it,
          hour_minute: dayjs(it.created_time).format("HH:mm"),
          date: dayjs(it.date).format("YYYY-MM-DD"),
          month: dayjs(it.date).format("YYYY-MM"),
          year: dayjs(it.date).format("YYYY"),
          bgcolor: types.find(type => type.id === it.type)?.bgcolor,
          color: types.find(type => type.id === it.type)?.color,
        }))
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

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

  }
})