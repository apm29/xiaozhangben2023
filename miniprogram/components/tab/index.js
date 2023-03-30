// components/tab/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value: {
      type: [Object,String,Number]
    },
    // 接收[ { name: xxx, value: xxx },...]格式
    tabs: {
      type: Array
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  attached(){
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleSelectTab(e) {
      const {
        value
      } = e.currentTarget.dataset;
      this.triggerEvent("select", value);
      this.setData({
        value: value
      })
    }
  }
})