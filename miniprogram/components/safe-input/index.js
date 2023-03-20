// components/safe-input/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value: {
      type: String
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
    content: [],
    cursorIndex: '', // 插入光标位置
    contentLengthMax: 12
  },

  attached: function () {
    if (this.value) {
      this.setData({
        content: this.value.split("")
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getStrPosition: function (e) {
      let {
        strIndex
      } = e.currentTarget.dataset
      this.setData({
        cursorIndex: strIndex
      })
    },

    handleConfirm(e){
      if(!this.data.content || !this.data.content.length){
        return wx.showToast({
          title: "请输入金额",
          icon: "error"
        })
      }
      this.triggerEvent("confirm",this.data.content.join(""))
    },

    keyTap(e) {
      let {
        keys
      } = e.currentTarget.dataset,
        content = this.data.content.join(''), // 转为字符串
        strLen = content.length, {
          cursorIndex,
          contentLengthMax
        } = this.data
      switch (keys) {
        case '.':
          if (strLen < contentLengthMax && content.indexOf('.') === -1) { // 已有一个点的情况下
            content.length < 1 ? content = '0.' : content += '.'
          }
          break
        case '<':
          if (cursorIndex > 0 && cursorIndex !== strLen) {
            // 从插入光标开始删除元素
            this.data.content.splice(cursorIndex - 1, 1)
            content = this.data.content.join('')
          } else {
            content = content.substr(0, content.length - 1)
          }
          if (!strLen || cursorIndex === strLen) { // 插入光标位置重置
            this.setData({
              cursorIndex: ''
            })
          }
          // 删除点 组件中可以用Observer监听删除点和删除0的情况
          if (content[0] === '0' && content[1] !== '.') {
            content = content.substr(1, content.length - 1)
          }
          if (content[0] === '.') {
            content = '0' + content
          }
          break
        default:
          let spotIndex = content.indexOf('.') //小数点的位置
          if (content[0] === '0' && content[1] !== '.') {
            content = content.substr(1, content.length - 1)
          }
          if (strLen < contentLengthMax && (spotIndex === -1 || strLen - spotIndex !== 3)) { //小数点后只保留两位
            content += keys
          }
          break
      }
      this.setData({
        content: content.split('')
      }) // 转为数组
      this.triggerEvent("input",this.data.content.join(""))
      this.setData({
        value: this.data.content.join("")
      })
    },
  }
})