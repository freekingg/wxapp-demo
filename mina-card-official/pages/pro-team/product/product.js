// pages/product/product.js

//获取应用实例
var app = getApp();

Page({

  data: {
    product_detail_url: 'http://www.sinelinked.com/sl/html/reservation-phone.html?productId=00ecdb96-f990-4c60-8eab-1261b8d4f979',
    webViewShow: false,
    productData: '',//产品信息
    productCompanyData: '',//公司信息
    shareImageUrl: '',
    xcx_title: '您的贴心保险顾问',
    page:1
  },
  webViewShow: function (e) {
    var that = this;
    var product_detail_url = e.currentTarget.dataset.url
    that.setData({
      product_detail_url: product_detail_url,
      webViewShow: true
    })
  },
  back: function () {
    that.setData({
      webViewShow: false
    })
  },
  previewImages: function (e) {
    var that = this;
    wx.previewImage({
      current: e.currentTarget.dataset.item,
      urls: [e.currentTarget.dataset.item],
      success: function (e) {
        console.log(this)
        wx.showToast({
          title: '长按保存到相册',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },

  onLoad: function (options) {
    app.editTabBarProTeam()
    wx.showLoading({
      title: '加载中',
      mask: true
    })

    var that = this;
    var accountId = options.account_id || wx.getStorageSync('account_id')
    // wx.request({
    //   url: 'https://www.sinelinked.com/agent/user/agent/company/product.sl',
    //   data: {
    //     accountId: accountId
    //   },
    //   success: function (res) {
    //     that.setData({
    //       productData: res.data
    //     })

    //     wx.hideLoading()

    //   }
    // })

    wx.request({
      url: 'https://www.sinelinked.com/agent/pb/product/shopProduct.sl',
      data: {
        phone: '18769526199'
      },
      success: function (res) {
        that.setData({
          productData: res.data
        })
        wx.hideLoading()

      }
    })

    wx.request({
      url: `https://www.sinelinked.com/agent/user/agent/person/search.sl`,
      data: {
        accountId: accountId
      },
      success: function (res) {
        wx.hideLoading()
        that.setData({
          productCompanyData: res.data.data[0],
          shareImageUrl: res.data.message.shareImageUrl,
          xcx_title: res.data.data[0].xcx_title
        })
        wx.hideLoading()
      }
    })

  },
  onShow: function () {

  },
  imageError: function (e) {
    var that = this
    if (e.target.id == "shareImageUrl") {
      var cMI = 'shareImageUrl'
      this.setData({
        [cMI]: 'http://www.sinelinked.com/static/other/pic-bg3.jpg',
        xcx_title: that.data.productCompanyData.xcx_title
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    var totalPage = parseInt(that.data.productData.total / 6)
    var page = that.data.productData.total++
    
    if (page > totalPage){
      wx.showToast({
        title: '没有更多了',
        icon: 'success',
        duration: 2000
      })
      return;
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: 'https://www.sinelinked.com/agent/pb/product/shopProduct.sl',
      data: {
        phone: '18769526199',
        page:2,
        rows:2
      },
      success: function (res) {

        var productDataStr = 'productData.data'
        var newArr
        for(var i = 0;i<res.data.data.length;i++){
          newArr = that.data.productData.data.concat(res.data.data[i])
        }
        that.setData({
          [productDataStr]: newArr
        })
        wx.hideLoading()

      }
    })

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    return {
      // title: that.data.productCompanyData.xcx_title || '您的贴心保险顾问',
      title: that.data.xcx_title,
      path: `/pages/agent/product/product?account_id=${that.data.productCompanyData.id}`,
      imageUrl: that.data.shareImageUrl + '?' + Math.random(),
      success: function (res) {
        // 转发成功

      },
      fail: function (res) {
        // 转发失败
      }
    }

  },
  lower: function () {
    console.log('lower')
    // 显示加载图标  
    // wx.showLoading({
    //   title: '玩命加载中',
    // })
  }

})