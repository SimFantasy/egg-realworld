# Egg + Mongoose 的 Realworld 服务端

基本实现了官方文档的所有接口。

### 与 Koa 版不同

1. 使用了 egg 框架
2. 使用 Joi 作为参数校验，感觉别 validate.js 好用点

### 坑：

egg-mongoose 在 egg 的框架中还是比较难用，model 中无法引入 ctx，导致很多实例方法都需要将 ctx 从 model 中传入，比较麻烦。

egg 的 this 挂载了很多东西，但是每次都需要解构，否则都需要使用 this，实际上比导入模块也要更加麻烦。
