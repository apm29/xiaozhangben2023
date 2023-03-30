// pages/charts/index.js
import * as echarts from '../../components/ec-canvas/echarts';
const computedBehavior = require("miniprogram-computed").behavior
const colorDict = {
  1:"#35AA62",//支出
  2:"#DEA106",//收入
  3:"#1296db",//全部
}

Page({

  behaviors:[computedBehavior],
  /**
   * 页面的初始数据
   */
  data: {
    type: 1,
    color: "#35AA62",
    ec: {
      lazyLoad: true
    }
  },

  // watch:{
  //   type(type){
  //     wx.setNavigationBarColor({
  //       backgroundColor: colorDict[type],
  //       frontColor: '#fff',
  //     })
  //   }
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  onReady(){
    this.initCharts()
  },

  initCharts(){
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
        series: [{
          label: {
            normal: {
              fontSize: 14
            }
          },
          type: 'pie',
          center: ['50%', '50%'],
          radius: ['20%', '40%'],
          data: [{
            value: 55,
            name: '北京'
          }, {
            value: 20,
            name: '武汉'
          }, {
            value: 10,
            name: '杭州'
          }, {
            value: 20,
            name: '广州'
          }, {
            value: 38,
            name: '上海'
          }]
        }]
      };
      chart.setOption(option);
      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chart = chart;
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
  },

  onUnload(){
    this.charts?.dispose()
  }

})