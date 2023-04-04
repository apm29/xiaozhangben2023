// components/expansion-panel/index.js
const computedBehavior = require("miniprogram-computed").behavior;
const defaultHeight = 500;
Component({
  behaviors: [computedBehavior],
  /**
   * 组件的属性列表
   */
  properties: {
    value: {
      type: Boolean
    },
    maxHeight: {
      type: Number,
      default: 500
    },
    data: {
      type: [Array]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    internalValue: false,
    heightOverflow: true,
    defaultHeight: defaultHeight,
  },

  attached() {
    this.setData({
      internalValue: Boolean(this.data.value)
    })
    this.handleOverflow()
  },

  watch: {
    value(value) {
      this.setData({
        internalValue: Boolean(value)
      });
    },
    data() {
      this.handleOverflow()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleExpand(e) {
      const expand = !this.data.internalValue
      this.triggerEvent("input", expand)
      this.setData({
        value: expand,
        internalValue: expand
      })
    },
    handleOverflow() {
      const selector = this.createSelectorQuery()
      selector.select(".expansion-content")
        .boundingClientRect()
        .exec(([node]) => {
          function rpx2px(rpx) {
            const { screenWidth } = wx.getSystemInfoSync()
            return rpx / 750 * screenWidth
          }
          this.setData({
            heightOverflow: node.height > rpx2px((this.data.maxHeight || defaultHeight))
          })
        })
    }
  }
})