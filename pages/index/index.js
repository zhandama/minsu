// index.js
// 获取应用实例
const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    lists: [],
    areas: [
      {name:'西湖',id:'0012978',imgUrl:'1'},
      {name:'萧山',id:'0011483',imgUrl:'2'},
      {name:'余杭',id:'0011487',imgUrl:'3'},
      {name:'淳安',id:'0011485',imgUrl:'4'},
      {name:'临安',id:'0011488',imgUrl:'5'},
      {name:'桐庐',id:'0011484',imgUrl:'6'},
      {name:'建德',id:'0011486',imgUrl:'7'},
      {name:'富阳',id:'0011489',imgUrl:'8'},
    ]
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
    var page = parseInt(Math.random()*10)+1+""
    util.request("/gethotel", {"page":page,"limit":"4","type":"1","num":"3"}, "POST", false, true).then((res) => {
      if (res && res.code === 200 && res.data) {
        this.setData({
          lists:res.data
        })
      }
    })
  },
  detail(e) {
    var id = e.currentTarget.id
    wx.navigateTo({
      url: `../productDetail/productDetail?id=${id}`
    })
  },
  onShareAppMessage: (res) => {
    return ''
  }
})
