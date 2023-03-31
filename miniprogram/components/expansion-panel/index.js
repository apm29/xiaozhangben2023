// components/expansion-panel/index.js
const computedBehavior = require("miniprogram-computed").behavior;
Component({
  behaviors: [computedBehavior],
  /**
   * 组件的属性列表
   */
  properties: {
    value:{
      type:Boolean
    },
    maxHeight:{
      type:Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    internalValue: false
  },

  attached(){
    this.setData({
      internalValue: Boolean(this.data.value)
    })
  },

  watch:{
    value(value){
      this.setData({
        internalValue: Boolean(value)
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleExpand(e){
      const expand = !this.data.internalValue
      this.triggerEvent("input",expand)
      this.setData({
        value: expand,
        internalValue: expand
      })
    }
  }
})
