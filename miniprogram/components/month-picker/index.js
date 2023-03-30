const dayjs = require("dayjs").default
const computedBehavior = require("miniprogram-computed").behavior
// components/month-picker/index.js
Component({

  behaviors:[computedBehavior],
  /**
   * 组件的属性列表
   */
  properties: {
    month:{
      type:String
    }
  },

  computed:{
    formattedMonth(data){
      return dayjs(data.month).format("YYYY年M月")
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleDateSelected(e){
      const newValue = dayjs(e.detail.value).format("YYYY-MM");
      this.triggerEvent("change",newValue)
      this.setData({
        month: newValue
      })
    }
  }
})
