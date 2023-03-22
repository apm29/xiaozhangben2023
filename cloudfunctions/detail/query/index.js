const cloud = require('wx-server-sdk');
const dayjs = require("dayjs")
const { processIconAndName } = require('./type_name_icon');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command
// 创建集合云函数入口函数
exports.main = async (event, context) => {
  try {
    // 获取账本
    const wxContext = cloud.getWXContext()


    const accountBook = db.collection('account-book');
    const { data: [currentBook] } = await accountBook.where({
      creator_openid: wxContext.OPENID,
    }).get()

    const details = db.collection('detail');
    const page_size = event.payload.page_size || 20
    const page_no = event.payload.page_no || 1
    const type_id = event.payload.type_id
    const sub_type_id = event.payload.sub_type_id
    const month = dayjs(event.payload.month).format("YYYY-MM")
    const nextMonth = dayjs(month).add(1,"month").format("YYYY-MM")
    
    const whereArgs = {
      creator_openid: wxContext.OPENID,
      account_book_id: event.payload.account_book_id,
      date: _.gte(month).lt(nextMonth),
    }
    if(type_id){
      whereArgs.type = _.eq(type_id)
    }
    if(sub_type_id){
      whereArgs.sub_type = _.eq(sub_type_id)
    }
    
    const {
      data
    } = await details.where(whereArgs)
    .orderBy("created_time","desc")
    .skip((page_no-1)*page_size)
    .limit(page_size)
    .get()

    //处理类型名称
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