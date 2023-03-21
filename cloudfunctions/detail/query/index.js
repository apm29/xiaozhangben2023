const cloud = require('wx-server-sdk');
const { processIconAndName } = require('./type_name_icon');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 创建集合云函数入口函数
exports.main = async (event, context) => {
  try {
    // 获取账本
    const wxContext = cloud.getWXContext()
    const details = db.collection('detail');
    const page_size = event.payload.page_size || 20
    const page_no = event.payload.page_no || 1
    const {
      data
    } = await details.where({
      creator_openid: wxContext.OPENID,
      account_book_id: event.payload.account_book_id,
    })
    .orderBy("created_time","desc")
    .skip((page_no-1)*page_size).limit(page_size).get()

    //处理类型名称
    const accountBook = db.collection('account-book');
    const { data: [currentBook] } = await accountBook.where({
      creator_openid: wxContext.OPENID,
    }).get()
    
    data.map(detail=>{
      return processIconAndName(
        detail,
        currentBook.expend_types,
        currentBook.income_types,
        currentBook.unincluded_types,
      )
    })
    return {
      success: true,
      msg: "获取明细成功",
      data
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