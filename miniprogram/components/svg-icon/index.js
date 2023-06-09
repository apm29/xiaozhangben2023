// components/svg-icon/index.js
// svg-icon
const { getIconifySVG, getLocalSVG } = require('../../utils/svg-icon');
const computedBehavior = require("miniprogram-computed").behavior;

Component({
  behaviors:[computedBehavior],
  /**
   * 组件的属性列表
   */
  properties: {
    name: {
      type: String,
      value: ''
    },
    color: {
      type: String,
      value: ''
    },
    size: {
      type: String,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    width: '1em',
    height: '1em',
    iconUrl: '',
  },

  watch:{
    name: function(name){
      this.getDataUri(name, this.data.color)
    }
  },

  lifetimes: {
    attached() {
      this.getDataUri(this.data.name, this.data.color)
      if (this.data.size) {
        this.setData({
          width: this.data.size,
          height: this.data.size,
        })
      }
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getDataUri(name, color) {
      const that = this
      const url = getLocalSVG(name)
      if (url) {
        this.setData({
          iconUrl: url,
        })
      } else {
        getIconifySVG(name).then(res => {
          that.setData({
            iconUrl: res,
          })
        }).catch(e => {
          console.log(e)
        })
      }
    },
  }
})
