const cloud = require('wx-server-sdk');
const dayjs = require("dayjs")
const {
  processIconAndName
} = require('../dict/type_name_icon');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command
const $ = db.command.aggregate
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

    let month = event.payload.month ? dayjs(event.payload.month).format("YYYY-MM") : dayjs().format("YYYY-MM")
    let nextMonth = dayjs(month).add(1, "month").format("YYYY-MM")

    const whereArgs = {
      creator_openid: wxContext.OPENID,
      account_book_id: event.payload.account_book_id,
      date: _.lt(nextMonth).gte(month),
      deleted: false
    }

    const aggregateResult = await details
      .aggregate()
      .match(whereArgs)
      .group({
        _id: {
          type: '$type',
          sub_type: '$sub_type',
        },
        amount: $.sum('$amount'),
        count: $.sum(1)
      })
      .end()

    //处理类型名称
    aggregateResult.list.forEach(detail => {
      return processIconAndName(
        detail._id,
        currentBook.expend_types,
        currentBook.income_types,
        currentBook.unincluded_types,
      )
    })
    return {
      success: true,
      msg: "获取月度分类统计成功",
      data: aggregateResult.list.map(it=>{
        return {
          ...it,
          type:it._id
        }
      }).sort((a,b)=> b.amount - a.amount)
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