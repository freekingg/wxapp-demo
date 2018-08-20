// pages/show/show.js
//获取应用实例
var app = getApp();

Page({
  data: {
    agentShowData: {},
    ImgSelfPath: [],
    ImgSelfCoverPath: '',
    ImgHeadPath: '',
    defaultHeadImg: 'http://www.sinelinked.com/static/other/default_head.png',
    accountId:'',
    xcx_title: '您的贴心保险顾问'
  },
  imageError: function (e) {
    var that = this
    //头像读取失败使用默认头像 
    if (e.target.id == "shareImageUrl") {
      var cMI = 'agentShowData.message.shareImageUrl'
      this.setData({
        [cMI]: 'http://www.sinelinked.com/static/other/pic-bg3.jpg',
        xcx_title: that.data.agentShowData.data[0].xcx_title
      })
    } else if (e.target.id == "ImgHeadPath") {
      var cMI = 'agentShowData.message.ImgHeadPath'
      this.setData({
        [cMI]: 'http://www.sinelinked.com/static/other/default_head.png'
      })
    }

    if (e.target.id == "ImgSelfCoverPath") {
      var cMI2 = 'agentShowData.message.ImgSelfCoverPath'
      this.setData({
        [cMI2]: 'http://www.sinelinked.com/static/other/show-bg.jpg'
      })
    }


  },

  onHide: function () {

  },
  onShow: function () {
    wx.showLoading({
      title: '加载中',
      mask:true
    })

    var that = this;

    var accountId = that.data.accountId || wx.getStorageSync('account_id')
    if (accountId) {
      wx.request({
        url: `https://www.sinelinked.com/agent/user/agent/person/search.sl`,
        data: {
          accountId: accountId
        },
        success: function (res) {
          
          // 防止图片缓存begin
          that.setData({
            agentShowData: res.data,
            ImgSelfCoverPath: res.data.message.ImgSelfCoverPath + '?' + Math.random(),
            ImgHeadPath: res.data.message.ImgHeadPath + '?' + Math.random(),
            // xcx_title: res.data.data[0].xcx_title
          })
          var newImgSelfPath = []
          for (var i = 0; i < res.data.message.ImgSelfPath.length; i++) {
            newImgSelfPath.push(res.data.message.ImgSelfPath[i] + '?' + Math.random())
          }
          that.setData({
            ImgSelfPath: newImgSelfPath
          })
          wx.hideLoading()
        }
      })
    }
    
  },

  onLoad: function (options) {
    var accountId = options.account_id || wx.getStorageSync('account_id')
    app.editTabBarAgent()
    wx.showLoading({
      title: '加载中',
      mask: true
    })

    this.setData({
      accountId: accountId
    })

  },
  random: function () {
    console.log(Math.random() * 2)
    return '111'
  },
  previewImages: function (e) {
    var that = this;
    wx.previewImage({
      current: e.currentTarget.dataset.item,
      urls: that.data.ImgSelfPath,
      success: function () {
        wx.setStorageSync('account_id', that.data.agentShowData.data[0].id)
      }
    })
    wx.hideLoading()
  },

  onShareAppMessage: function () {
    var that = this;
    return {
      // title: that.data.agentShowData.data[0].xcx_title || '您的贴心保险顾问',
      title: that.data.agentShowData.data[0].xcx_title,
      path: `/pages/agent/show/show?account_id=${that.data.agentShowData.data[0].id}`,
      imageUrl: that.data.agentShowData.message.shareImageUrl + '?' + Math.random(),
      success: function (res) {
        // 转发成功
        wx.setStorageSync('account_id', that.data.agentShowData.data[0].id)
      },
      fail: function (res) {
        // 转发失败
      }
    }

  }
})
