const util = require('../../utils/util.js')
Page({
  data: {
    pageIndex: 1,
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
    wx.navigateTo({
      url: '../newsDetail/newsDetail?articleid='+e.currentTarget.dataset.articleid
    })
  },
  getNews(type){
    if (type == 'refresh') {
      this.setData({
        pageIndex: 1
      })
    }
    util.request("https://www.hzminsu.cn/article!listPage.ajax", 
    {"pageObject.page":this.data.pageIndex,"pageObject.pagesize":"10","articleVo.status":"open","articleVo.categoryId":"002","articleVo.order":"create_date"}, "GET", false, true).then((res) => {
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
      if (res && res.code == 'success' && res.data) {
        res.data.dataList.map(x=>{
          x.date = util.formatDate(x.createDate)
        })
        this.setData({
          newsList: this.data.newsList.concat(res.data.dataList),
          pageIndex: this.data.pageIndex + 1
        })
        if (res.data.dataList.length<10) {
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