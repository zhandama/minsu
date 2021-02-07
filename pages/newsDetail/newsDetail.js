const util = require('../../utils/util.js')
Page({
  data: {
    articleId:'',
    datail:'',
    date:'',
    title:''
  },
  onLoad: function (options) {
    this.getData(options.id)
  },
  getData(id){
    util.request("/zxinfo", 
    {"id":id+''}, "POST", false, true).then((res) => {
      var datail = res.data.Content
      datail = datail.replace(/\<img/gi, '<img style="width:100%;height:auto"')
      var time = res.data.Text_time.substring(0,(res.data.Text_time.length)-6)
      this.setData({
        title:res.data.Name,
        date: util.formatDate(Number(time)),
        datail:datail
      })
    })
  },
  collection: function () {
    this.setData({
      isCollection: !this.data.isCollection
    }, () => {
      if (this.data.isCollection) {
        util.toast("收藏成功！");
      }
    })
  },
  onShareAppMessage(){
    
  }
})