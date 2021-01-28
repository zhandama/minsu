const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
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
    params:{
      page:'0',
      limit:'20',
      season:''
    },
  },
  onLoad(options) {
    this.setData({
      'params.page': '0'
    });
    this.getList()
  },
  getList(){
    if (this.data.params.page == 0) {
      this.setData({
        productList:[]
      })
    }
    util.request("/cxqdlist", this.data.params, "POST", false, false).then((res) => {
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
      'params.page': '0'
    })
    this.getList()
    wx.stopPullDownRefresh()
  },
  onReachBottom() {
    if (!this.data.pullUpOn) return;
    this.getList()
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
  }
})