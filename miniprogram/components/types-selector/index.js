// components/types-selector/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    types:{
      type: Array,
    },
    value:{
      type: Number
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
      console.log(e);
    }
  }
})
