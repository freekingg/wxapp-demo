// pages/about/about.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: 36.664100,
    longitude: 117.148530,
    markers: [{
      id: 1,
      latitude: 36.664100,
      longitude: 117.148530,
      name: 'T.I.T 创意园'
    }],
    covers: [{
      latitude: 36.664100,
      longitude: 117.148530,
      // iconPath: '/assets/images/location.png'
    }, {
        latitude: 36.664100,
        longitude: 117.148530,
      // iconPath: '/assets/images/location.png'
    }]

  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  },
  makePhoneCall(){
    wx.makePhoneCall({
      phoneNumber: '0531-88683408' //仅为示例，并非真实的电话号码
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})