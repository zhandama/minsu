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
    ],
    slideWidth: '', //滑块宽
		slideLeft: 0, //滑块位置
		totalLength: '', //当前滚动列表总长
		slideShow: false,
		slideRatio: '',
  },
  // 事件处理函数
  bindViewTap(e) {
    app.globalData.areaId = e.currentTarget.id
    wx.switchTab({
      url: `../productList/productList`
    })
  },
  bindViewSea(e){
    wx.navigateTo({
      url: `../seasons/seasons?season=${e.target.dataset.season}`
    })
  },
  bindViewSearch(){
    app.globalData.searchKeyWords = true
    wx.switchTab({
      url: `../productList/productList`
    })
  },
  onLoad() {
    let systemInfo = wx.getSystemInfoSync();
		this.setData({
			windowHeight: systemInfo.windowHeight - 35,
			windowWidth: systemInfo.windowWidth,
		})
    this.getInfo()
    //计算比例
		this.getRatio();
  },
  getInfo(){
    var page = parseInt(Math.random()*10)+""
    util.request("/gethotel", {"page":page,"limit":"4","type":"","num":"","hot":"","keyWords":"","area_id":"","season":"","months":""}, "POST", false, true).then((res) => {
      if (res && res.code === 200 && res.data) {
        this.setData({
          lists:res.data
        })
      }
    })
  },
  //根据分类获取比例
	getRatio() {
		const _this = this;
		if (!_this.data.areas || _this.data.areas.length <= 4) {
			this.setData({
				slideShow: false
			})
		} else {
			let _totalLength = _this.data.areas.length * 175; //分类列表总长度
			let _ratio = 100 / _totalLength * (750 / this.data.windowWidth); //滚动列表长度与滑条长度比例
			let _showLength = 750 / _totalLength * 100; //当前显示红色滑条的长度(保留两位小数)
			this.setData({
				slideWidth: _showLength,
				totalLength: _totalLength,
				slideShow: true,
				slideRatio: _ratio
			})
		}
	},
  detail(e) {
    var id = e.currentTarget.id
    wx.navigateTo({
      url: `../productDetail/productDetail?id=${id}`
    })
  },
  //slideLeft动态变化
	getleft(e) {
    console.log(e.detail.scrollLeft)
		this.setData({
			slideLeft: e.detail.scrollLeft * this.data.slideRatio
		})
	},
  onShareAppMessage: (res) => {
    return ''
  },
  bindViewUrl(e){
    wx.navigateTo({
      url: `/pages/newsDetailUrl/newsDetailUrl`
    })
  },
})
