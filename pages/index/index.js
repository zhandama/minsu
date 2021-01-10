// index.js
// 获取应用实例
const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  // 事件处理函数
  bindViewTap(e) {
    app.globalData.areaId = e.currentTarget.id
    wx.switchTab({
      url: `../productList/productList`
    })
  },
  onLoad() {
    this.getInfo()
  },
  getInfo(){
    util.request("/cdr", {"page":"10","limit":"10"}, "POST", false, true).then((res) => {

    })
  }
})
