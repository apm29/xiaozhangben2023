const Store = require('wxministore');

const store = new Store({
  state:{
    login: false,
    userInfo:{

    },
  }
})

module.exports = {
  store
}