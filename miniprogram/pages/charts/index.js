// pages/charts/index.js
import * as echarts from '../../components/ec-canvas/echarts';
const dayjs = require("dayjs").default;
const {
  post
} = require("../../utils/remote")
const defaultMonth = dayjs().format("YYYY-MM")
const computedBehavior = require("miniprogram-computed").behavior
const { colorDict } = require("../../dict/color")

Page({

  behaviors: [computedBehavior],
  /**
   * 页面的初始数据
   */
  data: {
    type: 1,
    typeDict: [{
      name: "支出",
      value: 1
    }, {
      name: "收入",
      value: 2
    }],
    color: colorDict[1],
    ec: {
      lazyLoad: true
    },
    month: defaultMonth,
    loadingSummary: false,
    monthSummary: {
      expenditure: 0,
      income: 0,
      unincluded: 0,
    },
    loadingComposition: false,
    monthComposition: []
  },

  computed:{
    monthCompositionMax(data){
      return data.monthComposition.filter(it=>it.type.type === data.type)
      .reduce((max,item)=>{
        return max > item.amount ? max : item.amount
      },0)
    },
    monthCompositionTyped(data){
      return data.monthComposition.filter(it=>it.type.type === data.type).map(it=>({
        ...it,
        amountText: it.amount.toFixed(2)
      }))
    }
  },

  watch: {
    type(type) {
      const color = colorDict[type]
      
      wx.setBackgroundColor({
        backgroundColor: color
      })
      wx.setNavigationBarColor({
        backgroundColor: color,
        frontColor: '#ffffff',
        animation: {
          duration: 300,
          timingFunc: "linear"
        }
      })
      this.setData({
        color: color
      });
    },
    "type,monthComposition": function (type, monthComposition) {
      // 获取组件
      const ecComponent = this.selectComponent('#echarts-container');
      ecComponent.init((canvas, width, height, dpr) => {
        this.charts?.dispose();
        // 获取组件的 canvas、width、height 后的回调函数
        // 在这里初始化图表
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio: dpr // new
        });
        const raw = monthComposition.sort((a, b) => b.amount - a.amount).filter(it => it.type.type === type).map(it => {
          return {
            name: it.type.sub_type_item.name,
            value: it.amount
          }
        });
        const dataDetail = raw.slice(0, 6)
        const dataOther = raw.slice(6).reduce((item, detail) => {
          item.value += detail.value
          return item
        }, {
          name: "其他",
          value: 0
        });
        const data = raw.length > 6 ? [...dataDetail, dataOther] : dataDetail
        chart.setOption({
          backgroundColor: "#ffffff",
          color: type === 1 ? [
            "#1296dbff",
            "#1296dbcc",
            "#1296db99",
            "#1296db66",
            "#1296db33",
            "#1296db11",
          ] : [
            "#DEA106ff",
            "#DEA106cc",
            "#DEA10699",
            "#DEA10666",
            "#DEA10633",
            "#DEA10611",
          ],
          avoidLabelOverlap: false,

          series: [{
            type: "pie",
            center: ['50%', '50%'],
            radius: ['30%', '60%'],
            itemStyle: {
              borderRadius: 1,
              borderColor: '#ffffff',
              borderWidth: 2
            },
            label: {
              formatter: "{b} {d}%",
              color: "#6d6d6d"
            },
            labelLine: {
              showAbove: true,
              lineStyle: {
                color: "#3d3d3d50"
              }
            },
            data: data
          }]
        })
        // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
        this.chart = chart;
        // 注意这里一定要返回 chart 实例，否则会影响事件处理等

        return chart;
      });

    },
    month() {
      this.getMonthSummary();
      this.getMonthComposition();
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  onPullDownRefresh(){
    Promise.all([
      this.getMonthSummary(),
      this.getMonthComposition()
    ]).then(()=>{
      wx.stopPullDownRefresh()
    })
  },

  async onShow() {
    this.getMonthSummary();
    this.getMonthComposition();
  },

  getMonthSummary() {
    this.setData({
      loadingSummary: true,
    })
    return post("detail", "query-month-total", {
      month: this.data.month
    }, {
      showLoading: false
    }).then(res => {
      this.setData({
        loadingSummary: false,
        monthSummary: res.data
      })
    })
  },

  getMonthComposition() {
    this.setData({
      loadingComposition: true,
    })
    return post("detail", "query-month-composition", {
      month: this.data.month
    }, {
      showLoading: true
    }).then(res => {
      console.log(res);
      this.setData({
        loadingComposition: false,
        monthComposition: res.data
      })
    })
  },


  onUnload() {
    this.charts?.dispose()
  },

  handleViewTyped(e){
    const subType = e.currentTarget.dataset.subType;
    const type = this.data.type;
    const month = this.data.month;
    wx.navigateTo({
      url: `/pages/month-typed/index?type=${type}&subType=${subType}&month=${month}`,
      fail:(err)=>console.log(err)
    })
  }


})