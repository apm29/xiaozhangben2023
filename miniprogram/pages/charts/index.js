// pages/charts/index.js
import * as echarts from '../../components/ec-canvas/echarts';
const dayjs = require("dayjs").default;
const {
  post
} = require("../../utils/remote")
const defaultMonth = dayjs().format("YYYY-MM")
const computedBehavior = require("miniprogram-computed").behavior
const colorDict = {
  1: "#1296db", //支出
  2: "#DEA106", //收入
}

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

  watch: {
    type(type) {
      console.log(type);
      this.setData({
        color: colorDict[type]
      });
      wx.setNavigationBarColor({
        backgroundColor: colorDict[type],
        frontColor: '#ffffff',
        animation: {
          duration: 300
        }
      })
    },
    "type,monthComposition": function (type, monthComposition) {

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
      this.chart.setOption({
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
          data: [...dataDetail, dataOther]
        }]
      })
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

  async onReady() {
    await this.initCharts();
    this.getMonthSummary();
    this.getMonthComposition();
  },

  getMonthSummary() {
    this.setData({
      loadingSummary: true,
    })
    post("detail", "query-month-total", {
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
    post("detail", "query-month-composition", {
      month: this.data.month
    }, {
      showLoading: false
    }).then(res => {
      console.log(res);
      this.setData({
        loadingComposition: false,
        monthComposition: res.data
      })
    })
  },

  initCharts() {
    return new Promise((resolve) => {
      // 获取组件
      const ecComponent = this.selectComponent('#echarts-container');
      ecComponent.init((canvas, width, height, dpr) => {
        console.log(arguments);
        // 获取组件的 canvas、width、height 后的回调函数
        // 在这里初始化图表
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio: dpr // new
        });
        const option = {
          backgroundColor: "transparent",
          series: []
        };
        chart.setOption(option);
        // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
        this.chart = chart;
        // 注意这里一定要返回 chart 实例，否则会影响事件处理等
        resolve()
        return chart;
      });
    })
  },

  onUnload() {
    this.charts?.dispose()
  }

})