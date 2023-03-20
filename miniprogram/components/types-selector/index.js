// components/types-selector/index.js
Component({
  externalClasses: ['selector-wrapper'],
  /**
   * 组件的属性列表
   */
  properties: {
    types:{
      type: Array,
    },
    value:{
      type: Number
    },
    height:{
      type: Number
    },
    color: {
      type: String
    },
    bgColor: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleSelectType: function(e){
      const item = e.currentTarget.dataset.item;
      this.triggerEvent("input", item.id);
      this.setData({
        value: item.id
      })
    }
  }
})
