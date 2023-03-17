const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 创建集合云函数入口函数
exports.main = async (event, context) => {
  try {
    // 获取账本
    const wxContext = cloud.getWXContext()
    const accountBook = db.collection('account-book');
   
    const { data:books } = await accountBook.where({
      creator_openid: wxContext.OPENID
    }).get()
    
    return {
      success: true,
      msg: "获取账本成功",
      data: books
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
