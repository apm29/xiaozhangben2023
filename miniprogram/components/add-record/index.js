const types = require("../../dict/types")
const { post } = require("../../utils/remote")
const dayjs = require("dayjs")
// components/add/index.js
Component({
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
      remark: null,
      formattedDate: dayjs().format("M月D日")
    },
    accountBooks:[],
    selectedBook: null,
    types: types
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
        "addFormModel.type": e.currentTarget.dataset.item.id

      })
    },
    handleDateSelected(e){
      this.setData({
        "addFormModel.date": dayjs(e.detail.value).format("YYYY-MM-DD"),
        "addFormModel.formattedDate": dayjs(e.detail.value).format("M月D日")
      })
    }
  }
})
