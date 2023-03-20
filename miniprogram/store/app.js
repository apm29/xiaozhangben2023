const Store = require('wxministore');

const store = new Store({
  state:{
    login: false,
    userInfo:{

    },
    accountBooks:[],
    selectedBook: null
  }
})

module.exports = {
  store
}