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
    pageIndex: 1,
    loadding: false,
    pullUpOn: true,
    params:{
      area_id:'',
      num:'',
      type:'0',
      page:'0',
      limit:'20',
      keyWords:'',
      hot:''
    },
    paramsCopy:''
  },
  onLoad(options) {
    let obj = wx.getMenuButtonBoundingClientRect();
    this.setData({
      width: obj.left,
      height: obj.top + obj.height + 8,
      inputTop: obj.top + (obj.height - 30) / 2,
      searchKey: options.searchKey || "",
      'params.areaId':app.globalData.areaId,
      'params.page': '1'
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
  getList(){
    if (this.data.params.page == 1) {
      this.setData({
        productList:[]
      })
    }
    util.request("/gethotel", this.data.params, "POST", false, false).then((res) => {
      if (res && res.code === 200) {
        this.setData({
          productList: this.data.productList.concat(res.data),
          'params.page': Number(this.data.params.page)+1+'',
          pullUpOn: true,
          loadding: false
        })
        if (res.data.length<this.data.params.limit) {
          this.setData({
            pullUpOn: false
          })
        }
      }
    })
  },
  onPullDownRefresh() {
    this.setData({
      'params.page': '1'
    })
    this.getList()
    wx.stopPullDownRefresh()
  },
  onReachBottom() {
    if (!this.data.pullUpOn) return;
    this.getList({pageIndex:this.pageIndex})
  },
  screen(e) {
    let index = e.currentTarget.dataset.index;
    if (index == 0) {
      this.setData({
        tabIndex: 0
      })
    } else if (index == 1) {
      this.setData({
        tabIndex: 1
      })
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
        'params.page': '1'
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
      'params.areaId':e.currentTarget.id
    })
  },
  layoutClick(e){
    var layout = e.currentTarget.dataset.layout,type = '1'
    if (this.data.params.num === layout) {
      layout = '';
      type = '0'
    }
    this.setData({
      'params.type':type,
      'params.num':layout
    })
  }
})