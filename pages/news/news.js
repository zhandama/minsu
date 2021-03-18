const util = require('../../utils/util.js')
Page({
  data: {
    pageIndex: 0,
    newsList: [],
    loadding: false,
    pullUpOn: true
  },
  onLoad: function(options) {
    this.getNews()
  },
  //页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function() {
    this.getNews('refresh')
  },

  // 页面上拉触底事件的处理函数
  onReachBottom: function() {
    if (!this.data.pullUpOn) return;
    this.setData({
      loadding: true
    }, () => {
      this.getNews()
    })
  },
  detail(e) {
    console.log(e.currentTarget.dataset.zxurl)
    if (e.currentTarget.dataset.zxurl&&e.currentTarget.dataset.zxurl.length>0) {
      wx.navigateTo({
        url: '../newsDetailUrl/newsDetailUrl?id='+e.currentTarget.dataset.id
      })
    } else {
      wx.navigateTo({
        url: '../newsDetail/newsDetail?id='+e.currentTarget.dataset.id
      })
    }
    
  },
  getNews(type){
    if (type == 'refresh') {
      this.setData({
        pageIndex: 0
      })
    }
    util.request("/getinformantion", 
    {"page":this.data.pageIndex+'',"limit":"10"}, "POST", false, true).then((res) => {
      if (type == 'refresh') {
        this.setData({
          newsList: [],
          pullUpOn: true,
          loadding: false
        })
        wx.stopPullDownRefresh()
        wx.showToast({
          title: '刷新成功',
          icon: "none"
        })
      }
      if (res && res.code == '200' && res.data) {
        res.data.map(x=>{
          var time = x.text_time.substring(0,(x.text_time.length)-6)
          x.date = util.formatDate(Number(time))
        })
        this.setData({
          newsList: this.data.newsList.concat(res.data),
          pageIndex: this.data.pageIndex + 1
        })
        if (res.data.length<10) {
          this.setData({
            loadding: false,
            pullUpOn: false
          })
        }
      } else {
        this.setData({
          loadding: false,
          pullUpOn: false
        })
      }
    })
  }
})