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
   
    await detail.doc(event.payload.id).update({
      data:{
        deleted: true
      }
    })
    // throw Error("不知道发生了什么呢")
    
    return {
      success: true,
      msg: "删除明细成功"
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
