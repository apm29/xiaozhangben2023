const dayjs = require("dayjs").default;
const defaultMonth = dayjs().format("YYYY-MM")
const types = require("../../dict/types")
const { eventBus } = require("../../utils/event-bus")
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
    //是否指定月份,默认不指定
    month: null,
    listTopMonth: defaultMonth,
    page: 1,
    size: 15,
    total: 0,
    refreshing: false,
    loading: false,
    hasMore: true,
    detailRawList: [],
    types: types,
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

  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("初始加载");
    this.getDetail()
  },

  handleScroll(e) {
    //获取最上面的日期
    wx.createSelectorQuery().select('#date-list').boundingClientRect((rect) => {
      wx.createSelectorQuery().selectAll('.date-item').boundingClientRect((items) => {
        items.sort((a, b) => {
          return a.top - b.top
        }).forEach((item) => {

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
    console.log("下拉刷新");
    this.setData({
      page: 1,
      detailRawList: [],
      //刷新后去掉月份
      month: null,
      hasMore: true
    })
    this.getDetail().finally(() => {
      this.setData({
        refreshing: false
      })
    })
  },

  handleTypeChange(e) {
    console.log("修改类型");
    //手动修改类型
    this.setData({
      page: 1,
      detailRawList: [],
      subTypeId: e.detail.subTypeId,
      typeId: e.detail.typeId,
      hasMore: true
    });
    this.getDetail()
  },

  handleMonthChange(e) {
    console.log("修改月份");
    //手动修改月份
    this.setData({
      page: 1,
      detailRawList: [],
      month: e.detail,
      hasMore: true
    });
    this.getDetail()
  },


  //加载更多
  handleLoadMore() {
    console.log("加载更多");
    this.getDetail()
  },

  async getDetail() {
    if (this.data.loading || !this.data.hasMore) {
      return
    }
    this.setData({
      loading: true,
    });
    const res = await post("detail", "query", {
      month: this.data.month,
      sub_type_id: this.data.subTypeId,
      type_id: this.data.typeId,
      page_no: this.data.page,
      page_size: this.data.size,
    }, {
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
    const newDetailRawList = [...this.data.detailRawList, ...old]
    const total = res.total
    this.setData({
      detailRawList: newDetailRawList,
      total: total,
      loading: false,
      hasMore: newDetailRawList.length < total,
      page: this.data.page + 1,
    });
  },

  handleAddDetail(e) {
    console.log("新增明细");
    post("detail", "create", e.detail, {
      showSuccess: true
    }).then(res => {
      eventBus.publish("addDetailSuccess")
      this.setData({
        //刷新
        page: 1,
        detailRawList: [],
        month: null,
        refreshing: true,
        hasMore: true
      });
      this.getDetail()
    })
  },


  
})