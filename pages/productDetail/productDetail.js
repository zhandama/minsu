const util = require('../../utils/util.js')
Page({
  data: {
    height: 64, //header高度
    top: 0, //标题图标距离顶部距离
    scrollH: 0, //滚动总高度
    opcity: 0,
    iconOpcity: 0.5,
    banner: [
      // "https://www.thorui.cn/img/product/11.jpg",
      // "https://www.thorui.cn/img/product/2.png",
      // "https://www.thorui.cn/img/product/33.jpg",
      // "https://www.thorui.cn/img/product/4.png",
      // "https://www.thorui.cn/img/product/55.jpg",
      // "https://www.thorui.cn/img/product/6.png",
      // "https://www.thorui.cn/img/product/7.jpg",
      // "https://www.thorui.cn/img/product/8.jpg"
    ],
    bannerIndex: 0,
    imgheights:[],
    detail:{},
    hotels:[],
    id:"",
    facility:[],
    hotels_index:''
  },
  onLoad: function (options) {
    let obj = wx.getMenuButtonBoundingClientRect();
    this.setData({
      width: obj.left,
      height: obj.top + obj.height + 8,
      top: obj.top + (obj.height - 32) / 2
    }, () => {
      wx.getSystemInfo({
        success: (res) => {
          this.setData({
            scrollH: res.windowWidth
          })
        }
      })
    });
    this.setData({
      id:options.id
    })
    this.getInfo(options.id)
  },
  bannerChange: function (e) {
    this.setData({
      bannerIndex: e.detail.current
    })
  },
  previewImage: function (e) {
    let index = e.currentTarget.dataset.index;
    wx.previewImage({
      current: this.data.banner[index],
      urls: this.data.banner
    })
  },
  //页面滚动执行方式
  onPageScroll(e) {
    let scroll = e.scrollTop <= 0 ? 0 : e.scrollTop;
    let opcity = scroll / this.data.scrollH;
    if (this.data.opcity >= 1 && opcity >= 1) {
      return;
    }
    this.setData({
      opcity: opcity,
      iconOpcity: 0.5 * (1 - opcity < 0 ? 0 : 1 - opcity)
    })
  },
  back: function () {
    wx.navigateBack()
  },
  getInfo(id){
    util.request("/gethotelinfo", {"hotel_id":id}, "POST", false, false).then((res) => {
      if (res && res.code === 200) {
        var imgs = []
        res.imgs.map(x=>{
          imgs.push(x.Url_path)
        })
        var facility = ''
        res.hotels.map(x=>{
          facility +=x.Facility_name
        })
        facility = [...new Set(facility.split(','))]
        this.setData({
          detail:res.data,
          banner:imgs,
          facility:facility,
          hotels:res.hotels
        })
      }
    })
  },
  imageLoad (e) {
    var imgwidth = e.detail.width;//获取图片实际宽度
    var imgheight = e.detail.height;//获取图片实际高度;
    //计算的高度值  
    var imgheight = 750 / imgwidth * imgheight; // （微信小程序默认总宽度750rpx）换算rpx单位的高度值
    let imgheights = this.data.imgheights
    //把当前图片的高度记录到图片数组里  
    imgheights[e.currentTarget.dataset.index]=imgheight
    this.setData({
      imgheights,
    })
  },
  tabHotels(e){
    var facility = ''
    if (this.data.hotels_index !== e.currentTarget.dataset.index) {
      facility = this.data.hotels[e.currentTarget.dataset.index].Facility_name.split(',')
    } else {
      this.data.hotels.map(x=>{
        facility +=x.Facility_name
      })
      facility = [...new Set(facility.split(','))]
    }
    this.setData({
      hotels_index: this.data.hotels_index !== e.currentTarget.dataset.index ? e.currentTarget.dataset.index:'',
      facility:facility
    })
  },
  onShareAppMessage: (res) => {
    if (res.from === 'button') {
      console.log("来自页面内转发按钮");
      return {
        title: res.target.dataset.Name,
        path: '/pages/productDetail/productDetail?id='+res.target.dataset.id,
        imageUrl: res.target.dataset.img,
        success: (res) => {
          console.log("转发成功", res);
        },
        fail: (res) => {
          console.log("转发失败", res);
        }
      }
    }
    else {
      console.log("来自右上角转发菜单")
      return 
    }
  }
})