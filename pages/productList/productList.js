const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    searchKey: "", //搜索关键词
    width: 200, //header宽度
    height: 64, //header高度
    inputTop: 0, //搜索框距离顶部距离
    dropScreenH: 0, //下拉筛选框距顶部距离
    dropScreenShow: false,
    scrollTop: 0,
    tabIndex: 0, //顶部筛选索引
    isList: false, //是否以列表展示  | 列表或大图
    drawer: false,
    drawerH: 0, //抽屉内部scrollview高度
    selectH: 0,
    productList: [],
    loadding: false,
    pullUpOn: true,
    areas:[
      {name:'不限',id:''},
      {name:'西湖区',id:'0012978'},
      {name:'萧山区',id:'0011483'},
      {name:'桐庐县',id:'0011484'},
      {name:'淳安县',id:'0011485'},
      {name:'建德市',id:'0011486'},
      {name:'余杭区',id:'0011487'},
      {name:'临安市',id:'0011488'},
      {name:'富阳区',id:'0011489'},
      {name:'拱墅区',id:'0012974'},
      {name:'其他',id:'0012979'},
    ],
    params:{
      area_id:'',
      num:'',
      type:'0',
      page:'0',
      limit:'20',
      keyWords:'',
      hot:'',
      season:'',
      months:''
    },
    paramsCopy:'',
    inputShowed:false,
  },
  onShow(){
    if (this.data.params.area_id!=app.globalData.areaId) {
      this.setData({
        'params.area_id':app.globalData.areaId,
        'params.page': '0'
      })
      this.getList()
    }
    if (app.globalData.searchKeyWords) {
      this.setData({
        inputShowed:true
      })
    }
  },
  onLoad(options) {
    let obj = wx.getMenuButtonBoundingClientRect();
    this.setData({
      width: obj.left,
      height: obj.top + obj.height + 8,
      inputTop: obj.top + (obj.height - 30) / 2,
      searchKey: options.searchKey || "",
      'params.area_id':app.globalData.areaId,
      'params.page': '0'
    }, () => {
      wx.getSystemInfo({
        success: (res) => {
          this.setData({
            //略小，避免误差带来的影响
            dropScreenH: this.data.height * 750 / res.windowWidth + 90,
            drawerH: res.windowHeight - res.windowWidth / 750 * 100 - this.data.height
          })
        }
      })
    });
    this.getList()
  },
  inputBlur(){
    app.globalData.searchKeyWords = false;
    this.setData({
      "inputShowed":false
    })
  },
  search(e){
    console.log(e.detail.value)
    if (this.data.keyWords!=e.detail.value) {
      this.setData({
        "params.keyWords":e.detail.value,
        "params.page":'0',
      })
      this.getList()
    }
  },
  getList(){
    if (this.data.params.page == 0) {
      this.setData({
        productList:[]
      })
    }
    util.request("/gethotel", this.data.params, "POST", false, false).then((res) => {
      if (res && res.code === 200 && res.data) {
        this.setData({
          productList: this.data.productList.concat(res.data),
          'params.page': Number(this.data.params.page)+1+'',
          pullUpOn: true,
          loadding: false
        })
        if (res.data && res.data.length<this.data.params.limit) {
          this.setData({
            pullUpOn: false
          })
        }
      }
    })
  },
  onPullDownRefresh() {
    this.setData({
      'params.page': '0'
    })
    this.getList()
    wx.stopPullDownRefresh()
  },
  onReachBottom() {
    if (!this.data.pullUpOn) return;
    this.getList()
  },
  screen(e) {
    let index = e.currentTarget.dataset.index;
    if (index == 0) {
      this.setData({
        tabIndex: 0,
        'params.hot':"",
        'params.page': '0'
      })
      this.getList()
    } else if (index == 1) {
      this.setData({
        tabIndex: 1,
        'params.hot':"1",
        'params.page': '0'
      })
      this.getList()
    } else if (index == 2) {
      this.setData({
        paramsCopy:JSON.stringify(this.data.params),
        drawer: true
      })
    }
  },
  closeDrawer() {
    this.setData({
      drawer: false
    })
    if (this.data.paramsCopy!=JSON.stringify(this.data.params)){
      this.setData({
        'params.page': '0'
      })
      this.getList()
    }
  },
  back() {
    if (this.data.drawer) {
      this.closeDrawer()
    } else {
      wx.navigateBack()
    }
  },
  detail(e) {
    var id = e.currentTarget.id
    wx.navigateTo({
      url: `../productDetail/productDetail?id=${id}`
    })
  },
  areaClick(e){
    this.setData({
      'params.area_id':e.currentTarget.id
    })
  },
  errorFunction(e){
    let index = e.currentTarget.dataset.index;
    if (e.type == "error") {//加载图片的类型为error时走下面的步骤
      let imgList = this.data.productList//获取当前图片所在数组
      imgList[index]['Url_path'] = '../../static/images/noimg.jpg' //错误图片替换为默认图片
      this.setData({
        productList: imgList
      })
    }
  },
  layoutClick(e){
    var layout = e.currentTarget.dataset.layout,type = '1'
    if (this.data.params.num === layout ||layout=='') {
      layout = '';
      type = '0'
    }
    this.setData({
      'params.type':type,
      'params.num':layout
    })
  },
  onShareAppMessage(){
    
  }
})