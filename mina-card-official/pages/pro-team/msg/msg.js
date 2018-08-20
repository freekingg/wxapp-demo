// pages/pro-team/msg/msg.js
//获取应用实例
var app = getApp();
Page({
  data: {
		agentData: {},
    consultData: {
      name: '',//姓名
      tel: '',//电话
      c: '',//内容
			tel_token: '',//验证码
    },
    pointerEvent: false,
    sendTxt: '',
		iCode:'',//返回验证码
    xcx_title: '您的贴心保险顾问',
		region: ['广东省', '广州市', '海珠区'],
		customItem: '全部'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabBarProTeam()
		    var that = this;
		    if (app.globalAgentData.data && app.globalAgentData.data != '') {
					console.log('globalAgentData已经有数据了')
		      that.setData({
		        agentData: app.globalAgentData
		      })
		
					console.log(that.data.agentData)
		    }else{
					console.log('globalAgentData还没有数据进行回调')
		      app.employIdCallback = function (agentDatas){
		        that.setData({
		          agentData: agentDatas
		        })
		      }
		    }
  },
  imageError: function (e) {
    var that = this;
    if (e.target.id == "shareImageUrl") {
      var cMI = 'agentData.message.shareImageUrl'
      this.setData({
        [cMI]: 'http://www.sinelinked.com/static/other/pic-bg3.jpg',
        xcx_title: that.data.agentData.data[0].pro_xcx_title
      })
    }

  },
  //监听内容
  bindKeyInputC: function (e) {
    var cStr = 'consultData.c'
    this.setData({
      [cStr]: e.detail.value
    })
  },
  //监听姓名
  bindKeyInputName: function (e) {

    var namelStr = 'consultData.name'
    this.setData({
      [namelStr]: e.detail.value
    })
  },
  //监听电话
  bindKeyInputTel: function (e) {
    var telStr = 'consultData.tel'
    this.setData({
      [telStr]: e.detail.value
    })
  },
  //监听验证码
  bindKeyInputTel_token: function (e) {
    var tel_token = 'consultData.tel_token'
    this.setData({
      [tel_token]: e.detail.value
    })
  },
	bindRegionChange: function (e) {
		console.log('picker发送选择改变，携带值为', e.detail.value)
		this.setData({
			region: e.detail.value
		})
	},
  // 提交咨询信息
  agentConsult: function (e) {
    var that = this;
		//验证验证码是否一致 
		if(that.data.consultData.tel_token != that.data.iCode){
			wx.showModal({
				title: '提示',
				content: '验证码填写错误',
				showCancel: false,
				success: function (res) {
				}
			})
			return
		}
    var uid = e.currentTarget.dataset.id
    wx.request({
      url: 'https://www.sinelinked.com/agent/pm/caPublish.sl',
      data: {
        t: 1,
        n: that.data.consultData.name,
        tel: that.data.consultData.tel,
        tid: '顾问团队;' + uid,
        c: that.data.consultData.c,
        tel_token: that.data.consultData.tel_token,
				ca:1,
				iCode:that.data.iCode
      },
      success: function (res) {
        wx.showModal({
          title: '提示',
          content: res.data.message,
          showCancel: false,
          success: function (res) {

          }
        })
      }
    })
  },
  // 发送验证码
  sendPhoneCode(e) {
    var that = this;
    wx.request({
      url: `https://www.sinelinked.com/pro-team/phone/message/send.sl`,
      data: {
        phone: that.data.consultData.tel,
        flag: "code_8"
      },
      success: function (res) {
        if (res.data.error == 0) {
          wx.showToast({
            title: '发送成功',
            icon: 'success',
            duration: 2000
          })
          that.setData({
            pointerEvent: true
          })
					that.setData({
						iCode:res.data.message.iCode
					})
          that.countdown()

        } else {

          wx.showToast({
            title: '发送失败',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  // 倒计时
  countdown: function (e) {
    var that = this;
    var timer;
    console.log(e)
    var countdownNum = 10

    function settime() {
      if (countdownNum <= 0) {
        that.setData({
          sendTxt: '发送验证码'
        })
        clearInterval(timer)
        countdownNum = 90;
        that.setData({
          pointerEvent: false
        })
        return;
      } else {
        that.setData({
          sendTxt: '重新发送' + countdownNum
        })
        countdownNum--;
      }
    }

    timer = setInterval(function () {
      settime()
    }, 1000)
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
    var that = this;
    return {
      // title: that.data.agentData.data[0].pro_xcx_title || '您的贴心保险顾问',
      title: that.data.xcx_title,
      path: `/pages/pro-team/msg/msg?account_id=${that.data.agentData.data[0].account_id}`,
      imageUrl: that.data.agentData.message.shareImageUrl + '?' + Math.random(),
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }

  },
})