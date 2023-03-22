const dayjs = require("dayjs").default;
const {
  post
} = require("../../utils/remote")
const computedBehavior = require("miniprogram-computed").behavior

// pages/home/index.js
Page({
  behavior: [computedBehavior],
  /**
   * 页面的初始数据
   */
  data: {
    typeId: null,
    subTypeId: null,
    month: dayjs().format("YYYY-MM"),
    page: 1,
    size: 20,
    refreshing: false,
    detailRawList: [],
  },

  computed: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getDetail()
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

  },

  handleRefresh(){
    this.setData({
      page:1,
      detailRawList: [],
      refreshing: true
    })
    this.getDetail().finally(()=>{
      this.setData({
        refreshing: false
      })
    })
  },

  async getDetail() {
    const res = await post("detail", "query", {
      month: this.data.month,
      sub_type_id: this.data.subTypeId,
      type_id: this.data.typeId,
      page_no: this.data.page,
      page_size: this.data.size
    });

    //处理显示
    const old = res.data.map(it => {
      return {
        ...it,
        hour_minute: dayjs(it.created_time).format("HH:mm"),
        date: dayjs(it.date).format("YYYY-MM-DD"),
        month: dayjs(it.date).format("YYYY-MM"),
        year: dayjs(it.date).format("YYYY"),
      }
    });
    //按天group
    const map = old.reduce((res, current) => {
      const dateArr = res[current.date]
      if (dateArr) {
        dateArr.push(current)
      } else {
        res[current.date] = [current]
      }
      return res;
    }, {})
    const arr = Object.keys(map).map(key => {
      return {
        date: key,
        month_date: dayjs(key).format("M月D日"),
        week_day: dayjs(key).locale("zh-cn").format("dddd"),
        items: map[key],
        summary:{
          income: map[key].reduce((sum,i)=>{
            if(i.type === 2){
              sum+=parseFloat(i.amount);
            }
            return sum;
          },0).toFixed(2),
          expenditure: map[key].reduce((sum,i)=>{
            if(i.type === 1){
              sum+=parseFloat(i.amount);
            }
            return sum;
          },0).toFixed(2)
        }
      }
    })
    arr.sort((a, b) => {
      return dayjs(a.date).isBefore(dayjs(b.date)) ? 1 : -1
    })
    this.setData({
      detailRawList: arr
    });
  },

  handleAddDetail(e) {
    console.log(e);
    post("detail", "create", e.detail, {
      showSuccess: true
    }).then(res => {
      this.getDetail()
    })
  },


  handleTypeChange(e) {

  },
})