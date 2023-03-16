# 小账本

## 参考文档
- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)

## windicss生成
执行以下命令,根据wxml文件中的class,由windicss生成对应的style,写入到miniprogram/windi.wxss中
```sh
sh ./miniprogram/gen-windicss.sh
```

## cloud function
```javascript
{
  name:"xxx", //函数名称
  data: {
    topic: "topic", //区分类型 create/update/delete等等
    payload: {
      
    }
  }
}
```

小程序端通用方法:
`miniprogram/utils/remote.js`导出`post`方法,接收参数列表:
- name 函数名称
- topic 函数topic,对应data.topic
- payload 负载的参数,对应data.payload

## 通用组件
- `authorization` : 用于区分登录态和非登录态,带默认slot

## 通用方法
- `App.setWatcher`: 监听函数,接收一个需要监听的对象和监听者对象(类似Vue中的watch对象)
