const util = require('../../utils/util.js')
Page({
  data: {
    searchKey: "", //搜索关键词
    width: 200, //header宽度
    height: 64, //header高度
    inputTop: 0, //搜索框距离顶部距离
    arrowTop: 0, //箭头距离顶部距离
    dropScreenH: 0, //下拉筛选框距顶部距离
    attrData: [],
    attrIndex: -1,
    dropScreenShow: false,
    scrollTop: 0,
    tabIndex: 0, //顶部筛选索引
    isList: false, //是否以列表展示  | 列表或大图
    drawer: false,
    drawerH: 0, //抽屉内部scrollview高度
    selectH: 0,
    productList: [{
        img: 1,
        name: "源居六然·西湖",
        sale: 599,
        factory: 899,
        address: "西湖旅宿"
      },
      {
        img: 2,
        name: "杭州东梓关守一茶舍民宿",
        sale: 29,
        factory: 69,
        address: "场口镇东梓关村东梓新居A-57"
      },
      {
        img: 3,
        name: "临安南山有约民宿",
        sale: 299,
        factory: 699,
        address: "西湖旅宿"
      },
      {
        img: 4,
        name: "杭州云月山间",
        sale: 1599,
        factory: 2899,
        address: "场口镇东梓关村东梓新居A-57"
      },
      {
        img: 5,
        name: "杭州西湖桂墅民宿",
        sale: 599,
        factory: 899,
        address: "天目山镇告岭村东关一组关口9号"
      },
      {
        img: 6,
        name: "杭州东梓关守一茶舍民宿",
        sale: 599,
        factory: 899,
        address: "天目山镇告岭村东关一组关口9号"
      },
      {
        img: 1,
        name: "欧莱雅（LOREAL）奇焕光彩粉嫩透亮修颜霜",
        sale: 599,
        factory: 899,
        address: "青芝坞137-138号"
      },
      {
        img: 2,
        name: "德国DMK进口牛奶",
        sale: 29,
        factory: 69,
        address: "河桥镇曹家村58号"
      },
      {
        img: 3,
        name: "【第2支1元】柔色尽情丝柔口红唇膏女士不易掉色保湿滋润防水 珊瑚红",
        sale: 299,
        factory: 699,
        address: "天目山镇告岭村东关一组关口9号"
      },
      {
        img: 4,
        name: "百雀羚套装女补水保湿护肤品",
        sale: 1599,
        factory: 2899,
        address: "青芝坞137-138号"
      }
    ],
    pageIndex: 1,
    loadding: false,
    pullUpOn: true
  },
  onLoad: function(options) {
    let obj = wx.getMenuButtonBoundingClientRect();
    this.setData({
      width: obj.left,
      height: obj.top + obj.height + 8,
      inputTop: obj.top + (obj.height - 30) / 2,
      arrowTop: obj.top + (obj.height - 32) / 2,
      searchKey: options.searchKey || ""
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
    this.getList({pageIndex:1})
  },
  getList(){
    util.request("/gethotel", {"page":"1","limit":"20","type":"1","num":"3"}, "POST", false, true).then((res) => {
      if (res && res.code === 200) {
        this.setData({
          productList: res.data,
          pageIndex: 1,
          pullUpOn: true,
          loadding: false
        })
      }
    })
  },
  onPullDownRefresh: function() {
    let loadData = JSON.parse(JSON.stringify(this.data.productList));
    loadData = loadData.splice(0, 10)
    this.setData({
      productList: loadData,
      pageIndex: 1,
      pullUpOn: true,
      loadding: false
    })
    wx.stopPullDownRefresh()
  },
  onReachBottom: function() {
    if (!this.data.pullUpOn) return;
    this.getList({pageIndex:this.pageIndex})
    // this.setData({
    //   loadding: true
    // }, () => {
    //   if (this.data.pageIndex == 4) {
    //     this.setData({
    //       loadding: false,
    //       pullUpOn: false
    //     })
    //   } else {
    //     let loadData = JSON.parse(JSON.stringify(this.data.productList));
    //     loadData = loadData.splice(0, 10)
    //     if (this.data.pageIndex == 1) {
    //       loadData = loadData.reverse();
    //     }
    //     this.setData({
    //       productList: this.data.productList.concat(loadData),
    //       pageIndex: this.data.pageIndex + 1,
    //       loadding: false
    //     })
    //   }
    // })
  },
  screen: function(e) {
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
        isList: !this.data.isList
      })
    } else if (index == 3) {
      this.setData({
        drawer: true
      })
    }
  },
  closeDrawer: function() {
    this.setData({
      drawer: false
    })
  },
  back: function() {
    if (this.data.drawer) {
      this.closeDrawer()
    } else {
      wx.navigateBack()
    }
  },
  search: function() {
    wx.navigateTo({
      url: '../news-search/news-search'
    })
  },
  detail: function() {
    wx.navigateTo({
      url: '../productDetail/productDetail'
    })
  }
})