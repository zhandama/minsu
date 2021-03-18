const util = require('../../utils/util.js')
Page({
  data: {
    zxurl:'',
  },
  onLoad: function (options) {
    this.getData(options.id)
  },
  getData(id){
    util.request("/zxinfo", 
    {"id":id+''}, "POST", false, true).then((res) => {
      this.setData({
        zxurl:res.data.Zxurl
      })
    })
  },
  onShareAppMessage(){
    
  }
})