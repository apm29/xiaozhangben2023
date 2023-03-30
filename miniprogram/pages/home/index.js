const dayjs = require("dayjs").default;
const defaultMonth = dayjs().format("YYYY-MM")
const types = require("../../dict/types")
const {
  post
} = require("../../utils/remote")
const computedBehavior = require("miniprogram-computed").behavior

// pages/home/index.js
Page({
  behaviors: [computedBehavior],
  /**
   * 页面的初始数据
   */
  data: {
    typeId: null,
    subTypeId: null,
    month: defaultMonth,
    listTopMonth: defaultMonth,
    page: 1,
    size: 20,
    total: 0,
    refreshing: false,
    loading: false,
    detailRawList: [],
    types: types,
    scrollTop: 0,
    liveScrollTop: 0,
    tempScrollTop: 0
  },

  computed: {
    dayGroupedList(data) {
      const old = data.detailRawList;
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
          summary: {
            income: map[key].reduce((sum, i) => {
              if (i.type === 2) {
                sum += parseFloat(i.amount);
              }
              return sum;
            }, 0).toFixed(2),
            expenditure: map[key].reduce((sum, i) => {
              if (i.type === 1) {
                sum += parseFloat(i.amount);
              }
              return sum;
            }, 0).toFixed(2)
          }
        }
      })
      arr.sort((a, b) => {
        return dayjs(a.date).isBefore(dayjs(b.date)) ? 1 : -1
      })
      return arr;
    }
  },

  watch: {
    
  },

  handleMonthChange(e){
    //手动修改月份
    this.setData({
      page: 1,
      detailRawList: [],
      month: e.detail,
    });
    this.getDetail();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getDetail()
  },

  handleScroll(e){
    const { scrollTop } = e.detail;
    this.setData({
      liveScrollTop: scrollTop
    })
    wx.createSelectorQuery().select('#date-list').boundingClientRect((rect)=>{
      wx.createSelectorQuery().selectAll('.date-item').boundingClientRect((items)=>{
        items.sort((a,b)=>{
          return a.top-b.top
        }).forEach((item)=>{

          if (item.top < rect.top && item.bottom > rect.top) {
            // console.log('可见的最顶部的日期为：' + item.dataset.date);
            const topMonth = dayjs(item.dataset.date).format("YYYY-MM")
            this.setData({
              listTopMonth: topMonth
            })
            return;
          }
        });
      }).exec();
    }).exec();
  },

  // 下拉刷新
  handleRefresh() {
    this.setData({
      page: 1,
      detailRawList: [],
      month: defaultMonth,
      refreshing: true
    })
    console.log(
      "refresh ==> ",
      "total:",this.data.total, 
      "raw size:",this.data.detailRawList.length,
      "month:",this.data.month,
      "page:",this.data.page,
      "total:",this.data.total
    );
    this.getDetail().finally(() => {
      this.setData({
        refreshing: false
      })
    })
  },


  //加载更多
  handleLoadMore() {
    if (this.data.loading) {
      return
    }

    
    console.log(
      "load more ==> ",
      "total:",this.data.total, 
      "raw size:",this.data.detailRawList.filter(it=>it.month === this.data.month).length,
      "month:",this.data.month,
      "page:",this.data.page,
      "total:",this.data.total
    );
    //本月没有更多了
    if (this.data.total <= this.data.detailRawList.filter(it=>it.month === this.data.month).length) {
      this.setData({
        month: dayjs(this.data.month).subtract(1, "month").format("YYYY-MM"),
      })
    } else {
      this.setData({
        page: this.data.page + 1,
      })
    }
    console.log("加载", this.data.month, this.data.page);
    this.getDetail()
  },

  async getDetail() {
    this.setData({
      loading: true,
      tempScrollTop: this.data.liveScrollTop
    });
    const res = await post("detail", "query", {
      month: this.data.month,
      sub_type_id: this.data.subTypeId,
      type_id: this.data.typeId,
      page_no: this.data.page,
      page_size: this.data.size
    },{
      showLoading: false
    });
   

    //处理显示
    const old = res.data.map(it => {
      return {
        ...it,
        hour_minute: dayjs(it.created_time).format("HH:mm"),
        date: dayjs(it.date).format("YYYY-MM-DD"),
        month: dayjs(it.date).format("YYYY-MM"),
        year: dayjs(it.date).format("YYYY"),
        bgcolor: this.data.types.find(type => type.id === it.type)?.bgcolor,
        color: this.data.types.find(type => type.id === it.type)?.color,
      }
    });
    this.setData({
      detailRawList: [...this.data.detailRawList, ...old],
      total: res.total,
      loading: false,
      scrollTop: this.data.tempScrollTop
    });
  },

  handleAddDetail(e) {
    console.log(e);
    post("detail", "create", e.detail, {
      showSuccess: true
    }).then(res => {
      this.setData({
        page: 1,
        detailRawList: [],
        month: defaultMonth,
        refreshing: true
      });
      this.getDetail()
    })
  },


  handleTypeChange(e) {

  },
})