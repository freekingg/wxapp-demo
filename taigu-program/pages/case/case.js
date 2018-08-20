// pages/case/case.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    fadeInDown: false,
    caseList: [
      {
        urlBg: 'http://www.sdteragram.com/miniprogram/image/case01.jpg',
        urlSm: 'http://www.sdteragram.com/miniprogram/image/case01-sm.jpg',
        title: '晟联保信传播平台',
        info: '精准、自发、高效的保险服务传播系统',
        tag: '应用系统'
      },
      {
        urlBg: 'http://www.sdteragram.com/miniprogram/image/case022.jpg',
        urlSm: 'http://www.sdteragram.com/miniprogram/image/case02-sm.jpg',
        title: '亿邮飞渡邮件管理系统',
        info: '对邮件进行管理，利用邮件实现轻办公应用，将为用户带来极大的便利。',
        tag: '应用系统'
      },
      {
        urlBg: 'http://www.sdteragram.com/miniprogram/image/case03.jpg',
        urlSm: 'http://www.sdteragram.com/miniprogram/image/case03-sm.jpg',
        title: '静轩国术馆',
        info: '对邮件进行管理，利用邮件实现轻办公应用，将为用户带来极大的便利。',
        tag: '网站建设'
      },
      {
        urlBg: 'http://www.sdteragram.com/miniprogram/image/case04.jpg',
        urlSm: 'http://www.sdteragram.com/miniprogram/image/case04-sm.jpg',
        title: '青少年非遗武术中心',
        info: '对邮件进行管理，利用邮件实现轻办公应用，将为用户带来极大的便利。',
        tag: '网站建设'
      },
      {
        urlBg: 'http://www.sdteragram.com/miniprogram/image/case05.jpg',
        urlSm: 'http://www.sdteragram.com/miniprogram/image/case05-sm.jpg',
        title: '优彩乐',
        info: '彩票数据分析服务，资深玩家的辅助工具 。',
        tag: '微信相关服务'
      },
      {
        urlBg: 'http://www.sdteragram.com/miniprogram/image/case06.jpg',
        urlSm: 'http://www.sdteragram.com/miniprogram/image/case06-sm.jpg',
        title: '传统武术三维评测系统',
        info: '建立传统武术标准姿态库，利用三维合成技术，实现三体式姿态的自主评测。',
        tag: '移动APP开发'
      },
    ],
    filterCaseList: []
  },
  // 顶部切换导航
  swithNav: function (e) {
    this.setData({
      fadeInDown: true
    })

    if (e.target.dataset.current == this.data.currentTab) {
      return false;
    } else {
      this.setData({
        currentTab: e.target.dataset.current
      })

      var filterCaseList = this.data.caseList.filter(function (item) {
        return item.tag == e.target.dataset.tag
      })

      if (filterCaseList.length <= 0) {
        this.setData({
          filterCaseList: this.data.caseList
        })
      } else {
        this.setData({
          filterCaseList: filterCaseList
        })
      }

    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      filterCaseList: this.data.caseList
    })
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