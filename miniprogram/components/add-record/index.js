const types = require("../../dict/types")
const { post } = require("../../utils/remote")
const dayjs = require("dayjs")
const computedBehavior = require("miniprogram-computed").behavior;
// components/add/index.js
Component({
  behaviors: [computedBehavior],
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    showAddModal: false,
    addFormModel: {
      amount:0,
      type: 1,
      date: dayjs().format("YYYY-MM-DD"),
      sub_type: 1,
      remark: null
    },
    accountBooks:[],
    selectedBook: null,
    types: types,
    btnEnterColor: types[0].color,
    btnEnterBgColor: types[0].bgcolor
  },

  computed:{
    formattedDate(data){
      return dayjs(data.addFormModel.date).format("M月D日")
    }
  },


  attached: function () {
    post("accountBook","query").then(res=>{
      this.setData({
        accountBooks: res.data,
        selectedBook: res.data && res.data.length && res.data[0]
      })
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    handleAddRecord: function(){
      this.setData({
        showAddModal: true
      })
    },
    handleClose: function(){
      this.setData({
        showAddModal: false
      })
    },
    handleSelectType(e){
      this.setData({
        "addFormModel.type": e.currentTarget.dataset.item.id,
        btnEnterColor: e.currentTarget.dataset.item.color,
        btnEnterBgColor: e.currentTarget.dataset.item.bgcolor
      })
    },
    handleDateSelected(e){
      this.setData({
        "addFormModel.date": dayjs(e.detail.value).format("YYYY-MM-DD")
      })
    }
  }
})
