 function watch(data, watcher) {
   Object.keys(watcher).forEach(v => {
     observe(data, v, watcher[v])
   })
 }

 function observe(obj, key, watchFn) {
   let val = obj[key];
   Object.defineProperty(obj, key, {
     configurable: true,
     enumerable: true,
     set: function (value) {
       val = value;
       watchFn(value, val); // 赋值(set)时，调用对应函数
     },
     get: function () {
       return val;
     }
   })
 }


 module.exports = {
   watch,
   observe
 }