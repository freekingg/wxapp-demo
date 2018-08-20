//index.js
//获取应用实例
var app = getApp();

Page({
	data: {
		agentData: {},
		createTime: '2018',
		defaultHeadImg: 'http://www.sinelinked.com/static/other/default_head.png',
		consultData: {
			name: '', //姓名
			tel: '', //电话
			c: '', //内容
			tel_token: '' //验证码
		},
		pointerEvent: false,
		sendTxt: '',
		teamId: '',
		scene: '',
		xcx_title: '您的贴心保险顾问'
	},
	imageError: function (e) {
		var that = this;
		if (e.target.id == "shareImageUrl") {
			var cMI = 'agentData.message.shareImageUrl'
			this.setData({
				[cMI]: 'http://www.sinelinked.com/static/other/pic-bg3.jpg',
				xcx_title: that.data.agentData.data[0].pro_xcx_title
			})
		} else if (e.target.id == "ImgHeadPath") {
			//头像读取失败使用默认头像 
			var cMI = 'agentData.message.ImgHeadPath'
			this.setData({
				[cMI]: 'http://www.sinelinked.com/static/other/default_head.png'
			})
		}

	},
	makePhoneCall: function (phone) {
		var that = this
		wx.makePhoneCall({
			phoneNumber: that.data.agentData.data[0].phone //仅为示例，并非真实的电话号码
		})
	},
	//时间戳转格式
	formatDate: function (date) {
		var Y = date.getFullYear() + '-';
		var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
		var D = date.getDate() + ' ';
		var h = date.getHours() + ':';
		var m = (date.getMinutes() + 1 < 10 ? '0' + (date.getMinutes() + 1) : date.getMinutes() + 1);
		return (Y + M + D);
	},
	onLoad: function (options) {
		app.editTabBarProTeam()
		var that = this;
		if (options.teamId) {
			that.setData({
				scene: options.teamId
			})
			wx.setStorageSync('teamId', options.teamId)
		}

		// 扫码场景下，获取用户信息account_id
		var scene = decodeURIComponent(options.scene)
		var account_id = scene.split('=')[1]
		if (account_id) {
			that.setData({
				teamId: account_id
			})
			wx.setStorageSync('teamId', account_id)
		}
	},
	onShow() {
		wx.showLoading({
			title: '加载中',
			mask: true
		})
		var that = this;
		var teamId = that.data.scene || wx.getStorageSync('teamId')
		if (teamId) {
			that.setData({
				teamId: teamId
			})
			wx.request({
				url: 'https://www.sinelinked.com/pro-team/user/proteam/info.sl',
				data: {
					accountId: teamId
				},
				success: function (res) {
					that.setData({
						agentData: res.data,
						xcx_title: res.data.data[0].pro_xcx_title
					})

					//格式团队创建时间 
					that.setData({
						createTime: that.formatDate(new Date(that.data.agentData.data[0].creat_time))
					})
					wx.hideLoading()
				}
			})
		} else if (that.data.scene) {
			wx.request({
				url: 'https://www.sinelinked.com/pro-team/user/proteam/info.sl',
				data: {
					accountId: that.data.scene
				},
				success: function (res) {
					that.setData({
						agentData: res.data,
						xcx_title: res.data.data[0].pro_xcx_title
					})
					wx.setStorageSync('teamId', that.data.scene)
					wx.hideLoading()
				}
			})

		} else {
			var teamId = that.data.teamId
			if (teamId) {
				that.setData({
					teamId: teamId
				})

				wx.request({
					url: 'https://www.sinelinked.com/pro-team/user/proteam/info.sl',
					data: {
						accountId: teamId
					},
					success: function (res) {
						console.log(res)
						that.setData({
							agentData: res.data,
							xcx_title: res.data.data[0].pro_xcx_title
						})
						//格式团队创建时间 
						that.setData({
							createTime: that.formatDate(new Date(that.data.agentData.data[0].creat_time))
						})
						wx.hideLoading()
					}
				})

				wx.setStorageSync('teamId', teamId)

			}
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
	//监听提交
	agentConsult: function (e) {
		var that = this;
		var uid = e.currentTarget.dataset.id
		wx.request({
			url: 'https://www.sinelinked.com/agent/pm/publish.sl',
			data: {
				t: 1,
				n: that.data.consultData.name,
				tel: that.data.consultData.tel,
				uid: '保险顾问;' + uid,
				c: that.data.consultData.c,
				tel_token: that.data.consultData.tel_token
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
			url: `https://www.sinelinked.com/agent/phone/message/send.sl`,
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
	navigatorTeam: function () {
		wx.navigateTo({
			url: '/pages/member/member'
		})
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		var that = this;
		return {
			// title: that.data.agentData.data[0].pro_xcx_title || '您的贴心保险顾问',
			title: that.data.xcx_title,
			path: `/pages/pro-team/index/index?teamId=${that.data.teamId}`,
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
