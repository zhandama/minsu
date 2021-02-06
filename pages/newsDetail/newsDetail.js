const util = require('../../utils/util.js')
Page({
  data: {
    articleId:'',
    datail:'',
    date:'',
    contact:''
  },
  onLoad: function (options) {
    console.log(options)
    this.getData(options.articleid)
  },
  getData(articleId){
    util.request("https://www.hzminsu.cn//article!detail.ajax", 
    {"articleVo.articleId":articleId}, "POST", true, true).then((res) => {
      var datail = this.decode(res.data.articleExtVo.content)
      datail = datail.replace(/\<img/gi, '<img style="width:100%;height:auto" ')
      this.setData({
        contact:res.data,
        date: util.formatDate(res.data.createDate),
        datail:datail
      })
    })
  },
  decode: function(input) {
    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    while(i < input.length) {
      enc1 = _keyStr.indexOf(input.charAt(i++));
      enc2 = _keyStr.indexOf(input.charAt(i++));
      enc3 = _keyStr.indexOf(input.charAt(i++));
      enc4 = _keyStr.indexOf(input.charAt(i++));
      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;
      output = output + String.fromCharCode(chr1);
      if(enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }
      if(enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }
    }
    output = this._utf8_decode(output);
    return output;
  },
  _utf8_decode: function(utftext) {
    var string = "";
    var i = 0;
    var c = 0,c1 = 0,c2 = 0;
    while(i < utftext.length) {
      c = utftext.charCodeAt(i);
      if(c < 128) {
        string += String.fromCharCode(c);
        i++;
      } else if((c > 191) && (c < 224)) {
        c2 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        c2 = utftext.charCodeAt(i + 1);
        var c3 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }
    }
    return string;
  },
  collection: function () {
    this.setData({
      isCollection: !this.data.isCollection
    }, () => {
      if (this.data.isCollection) {
        util.toast("收藏成功！");
      }
    })
  }
})