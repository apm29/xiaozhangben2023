// components/types-picker/index.js
const computedBehavior = require("miniprogram-computed").behavior
Component({
  behaviors:[computedBehavior],
  /**
   * 组件的属性列表
   */
  properties: {
    typeId: {
      type: [Number,String],
    },
    subTypeId: {
      type: [Number,String],
    }
  },

  attached(){
    this.setData({
      selectedTypeId: this.properties.typeId,
      selectedSubTypeId: this.properties.subTypeId
    })
  },

  /**
   * 组件的初始数据
   */
  data: {
    selectedTypeId: null,
    selectedSubTypeId: null,
    showDialog: false
  },

  computed:{
    selectedTypeName(data){
      const accountBook = getApp().store.getState().selectedBook || {};

      const typeDict = {
        [1]: accountBook.expend_types,
        [2]: accountBook.income_types,
        [3]: accountBook.unincluded_types
      }
      const types = typeDict[data.selectedTypeId] || []

      const nameObj = types.find(it=> it.id === data.selectedSubTypeId) || { name: "全部类型" };
      return nameObj.name
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleShowModal(){
      this.setData({
        showDialog: true
      })
    },

    handleSelectType(e){
      const typeId = e.currentTarget.dataset.type;
      const subTypeId = e.currentTarget.dataset.subtype;
      this.triggerEvent("update:typeId",typeId);
      this.triggerEvent("update:subTypeId",subTypeId);
      this.triggerEvent("input",{typeId,subTypeId});
      this.setData({
        //props
        typeId,
        subTypeId,
        //data
        selectedTypeId: typeId,
        selectedSubTypeId: subTypeId,
        showDialog: false
      });
    }
  }
})
