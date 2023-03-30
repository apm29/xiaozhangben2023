const cloud = require('wx-server-sdk');
const dayjs = require("dayjs")

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
    const {
      data: [currentBook]
    } = await accountBook.where({
      creator_openid: wxContext.OPENID,
    }).get()

    const details = db.collection('detail');
  
    const type_id = event.payload.type_id
    const sub_type_id = event.payload.sub_type_id
    let month = event.payload.month ? dayjs(event.payload.month).format("YYYY-MM") : dayjs()
    let nextMonth = dayjs(month).add(1, "month").format("YYYY-MM")

    const whereArgs = {
      creator_openid: wxContext.OPENID,
      account_book_id: event.payload.account_book_id,
      date:  _.lt(nextMonth).gte(month),
      deleted: false
    }
    if (type_id) {
      whereArgs.type = _.eq(type_id)
    }
    if (sub_type_id) {
      whereArgs.sub_type = _.eq(sub_type_id)
    }
    const whereQuery = details.where(whereArgs)
      .orderBy("date", "desc");
    const {
      data
    } = await whereQuery
      .get()

    const { expenditure,income,unincluded } = data.reduce((sum,detail)=>{
      if(detail.type === 1){
        sum.expenditure += parseFloat(detail.amount)
      } else if(detail.type === 2){
        sum.income +=parseFloat(detail.amount)
      } else if(detail.type === 3){
        sum.unincluded +=parseFloat(detail.amount)
      }
      return sum
    },{ expenditure:0,income:0,unincluded:0 })

    return {
      success: true,
      msg: "获取月度小结成功",
      data: {
        expenditure:expenditure.toFixed(2),
        income:income.toFixed(2),
        unincluded:unincluded.toFixed(2)
      }
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