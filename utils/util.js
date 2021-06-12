//公共js，主要做表单验证，以及基本方法封装 
const utils = {
  isNullOrEmpty: function(value) {
    //是否为空
    return (value === null || value === '' || value === undefined) ? true : false;
  },
  trim: function(value) {
    //去空格
    return value.replace(/(^\s*)|(\s*$)/g, "");
  },
  formatDate: function(fdate, formatStr) {
    //日期格式化
    if (fdate) {
      var fTime, fStr = 'ymdhis'
      if (!formatStr) {
        formatStr = "y-m-d h:i:s"
      }
      if (fdate) {
        fTime = new Date(fdate)
      } else {
        fTime = new Date()
      }
      console.log(fTime)
      var month = fTime.getMonth() + 1
      var day = fTime.getDate()
      var hours = fTime.getHours()
      var minu = fTime.getMinutes()
      var second = fTime.getSeconds()
      month = month < 10 ? '0' + month : month
      day = day < 10 ? '0' + day : day
      hours = hours < 10 ? ('0' + hours) : hours
      minu = minu < 10 ? '0' + minu : minu
      second = second < 10 ? '0' + second : second
      var formatArr = [
        fTime.getFullYear().toString(),
        month.toString(),
        day.toString(),
        hours.toString(),
        minu.toString(),
        second.toString()
      ]
      for (var i = 0; i < formatArr.length; i++) {
        formatStr = formatStr.replace(fStr.charAt(i), formatArr[i])
      }
      return formatStr
    } else {
      return ''
    }
  },
  interfaceUrl: function() {
    //接口地址
    // return "https://www.thorui.cn";
    // return "http://101.37.202.197:8091";
    return "https://minsu.wgly.hangzhou.gov.cn/app"
  },
  toast: function(text, duration, success) {
    wx.showToast({
      title: text,
      icon: success ? 'success' : 'none',
      duration: duration || 2000
    })
  },
  request: function(url, postData, method, type, hideLoading) {
    //接口请求
    if (!hideLoading) {
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
    }
    return new Promise((resolve, reject) => {
      wx.request({
        url: url.indexOf('http')==-1?this.interfaceUrl() + url:url,
        data: postData,
        header: {
          'content-type': type ? 'application/x-www-form-urlencoded' : 'application/json'
        },
        method: method, //'GET','POST'
        dataType: 'json',
        success: (res) => {
          !hideLoading && wx.hideLoading()
          resolve(res.data)
        },
        fail: (res) => {
          !hideLoading && this.toast("网络不给力，请稍后再试~")
          //wx.hideLoading()
          reject(res)
        }
      })
    })
  }
}

module.exports = {
  isNullOrEmpty: utils.isNullOrEmpty,
  trim: utils.trim,
  interfaceUrl: utils.interfaceUrl,
  toast: utils.toast,
  request: utils.request,
  formatDate:utils.formatDate
}