const types = require("../../dict/types")
const dayjs = require("dayjs").default
const computedBehavior = require("miniprogram-computed").behavior;
const {
  eventBus
} = require("../../utils/event-bus");

const app = getApp()
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
    amount: 0,
    type: 1,
    date: dayjs().format("YYYY-MM-DD"),
    sub_type: 1,
    remark: null,

    //字典
    types: types,

    //子类型
    subTypes: []
  },

  computed: {
    formattedDate(data) {
      return dayjs(data.date).format("M月D日")
    },

    btnEnterColor(data) {
      const find = data.types.find(it => {
        return it.id === data.type
      })
      return find ? find.color : data.types[0].color
    },
    btnEnterBgColor(data) {
      const find = data.types.find(it => {
        return it.id === data.type
      })
      return find ? find.bgcolor : data.types[0].bgcolor
    },
  },

  watch: {
    type(type) {
      //重置子类型
      this.setData({
        sub_type: 1
      })
      //更新子类型字典
      const state = app.store.getState();
      this.handleTypeAndAccountBookChange(type, state)
    }
  },



  attached: function () {
    eventBus.subscribe("accountBook", () => {
      const state = app.store.getState();
      this.handleTypeAndAccountBookChange(this.data.type, state)
    })

    eventBus.subscribe("addDetailSuccess",()=>{
      this.setData({
        amount: 0,
        type: 1,
        date: dayjs().format("YYYY-MM-DD"),
        sub_type: 1,
        remark: null,
      })
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    handleAddRecord: function () {
      this.setData({
        showAddModal: true
      })
    },
    handleClose: function () {
      this.setData({
        showAddModal: false
      })
    },
    handleSelectType(e) {
      this.setData({
        type: e.currentTarget.dataset.item.id
      })
    },
    handleDateSelected(e) {
      this.setData({
        date: dayjs(e.detail.value).format("YYYY-MM-DD")
      })
    },
    handleAddDetail() {
      if (!this.data.type || !this.data.sub_type) {
        return wx.showToast({
          title: '请设置收支类型',
        })
      }
      if (!this.data.amount) {
        return wx.showToast({
          title: '请输入金额',
        })
      }
      this.setData({
        showAddModal: false
      });

      this.triggerEvent("add", {
        amount: this.data.amount,
        type: this.data.type,
        date: this.data.date,
        sub_type: this.data.sub_type,
        remark: this.data.remark,
        account_book_id: getApp().store.getState().selectedBook._id
      })
    },

    handleTypeAndAccountBookChange(type, state) {
      if (!state.selectedBook) {
        this.setData({
          subTypes: []
        })
        return;
      }
      if (type === 1) {
        this.setData({
          subTypes: state.selectedBook.expend_types
        });
      }
      if (type === 2) {
        this.setData({
          subTypes: state.selectedBook.income_types
        });
      }
      if (type === 3) {
        this.setData({
          subTypes: state.selectedBook.unincluded_types
        });
      }
    }
  }
})