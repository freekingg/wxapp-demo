Page({
  onShareAppMessage: function (res) {
    
    return {
      title: '山东泰顾网络科技有限公司',
      path: '/pages/index/index',
      // imageUrl:'http://www.sdteragram.com/miniprogram/image/banner03.jpg',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  data:{
    fadeInDown:false
  },

  onLoad: function (options){
    wx.showLoading({
      title: 'loading'
    })
    var scene = decodeURIComponent(options.scene)
    console.log(scene)
  },
   /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideLoading()
    this.setData({
      fadeInDown:true
    })
  },
})