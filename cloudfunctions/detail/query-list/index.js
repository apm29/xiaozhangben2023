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
// 按条件查询
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

    //分页参数
    const page_size = event.payload.page_size || 20;
    const page_no = event.payload.page_no || 1;

    //月份指定
    let month = event.payload.month ? dayjs(event.payload.month).format("YYYY-MM") : null;
    let nextMonth = month ? dayjs(month).add(1, "month").format("YYYY-MM") : null;

    //类型指定
    const type_id = event.payload.type_id;
    const sub_type_id = event.payload.sub_type_id;

    //remark指定
    const remark = event.payload.remark;

    //字段排序指定
    let orderBy = event.payload.orderBy;
    let order = event.payload.order;

    //排序字段检测
    if (orderBy && !Array.isArray(orderBy)) {
      orderBy = [orderBy]
    }
    if (order && !Array.isArray(order)) {
      order = [order]
    }
    if (orderBy?.length != order?.length) {
      return {
        success: false,
        msg: "请提供正确的排序字段"
      }
    }
    const whereArgs = {
      creator_openid: wxContext.OPENID,
      account_book_id: event.payload.account_book_id,
      deleted: false,
    }
    if (month) {
      whereArgs.date = _.lt(nextMonth).gte(month);
    }
    if (type_id) {
      whereArgs.type = _.eq(type_id);
    }
    if (sub_type_id) {
      whereArgs.sub_type = _.eq(sub_type_id);
    }
    if (remark) {
      whereArgs.remark = _.eq(remark);
    }


    let whereQuery = details.where(whereArgs)
    orderBy?.forEach((_, index) => {
      whereQuery.orderBy(orderBy[index], order[index])
    });

    const {
      total
    } = await whereQuery.count()
    const {
      data
    } = await whereQuery
      .skip((page_no - 1) * page_size)
      .limit(page_size)
      .get()

    //处理类型名称
    data.forEach(detail => {
      return processIconAndName(
        detail,
        currentBook.expend_types,
        currentBook.income_types,
        currentBook.unincluded_types,
      )
    })

    return {
      success: true,
      msg: "获取明细列表成功",
      data,
      total,
      page_no,
      page_size,
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      msg: `${e}`
    };
  }
};