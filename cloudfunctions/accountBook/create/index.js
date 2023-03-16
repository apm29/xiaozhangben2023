const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 创建集合云函数入口函数
exports.main = async (event, context) => {
  try {
    // 创建集合
    const wxContext = cloud.getWXContext()
    const accountBook = db.collection('account-book');
    accountBook.add({
      data:{
        ...event.payload,
        creator_openid: wxContext.OPENID,
        created_time: new Date()
      }
    })
    // throw Error("不知道发生了什么呢")
    
    return {
      success: true
    };
  } catch (e) {
    // 这里catch到的是该collection已经存在，从业务逻辑上来说是运行成功的，所以catch返回success给前端，避免工具在前端抛出异常
    console.log(e);
    return {
      success: false,
      msg: `${e}`
    };
  }
};
