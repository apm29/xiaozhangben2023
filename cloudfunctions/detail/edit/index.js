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
    const detail = db.collection('detail');
    if(!event.payload.id){
      return {
        success: false,
        msg: `未找到明细`
      };
    }
    event.payload.amount = parseFloat(event.payload.amount)
    if(!event.payload.amount){
      return {
        success: false,
        msg: `金额不可为空`
      };
    }
    if(!event.payload.account_book_id){
      return {
        success: false,
        msg: `账本未选择`
      };
    }
    if(!event.payload.date){
      return {
        success: false,
        msg: `日期未选择`
      };
    }
    if(!event.payload.type || !event.payload.sub_type){
      return {
        success: false,
        msg: `类型不可为空`
      };
    }
    await detail.doc(event.payload.id).update({
      data:{
        update_openid: wxContext.OPENID,
        ...event.payload,
        updated_time: new Date()
      }
    })
    // throw Error("不知道发生了什么呢")
    
    return {
      success: true,
      msg: "修改明细成功"
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
