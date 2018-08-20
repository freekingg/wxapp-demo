//index.js
//获取应用实例
var app = getApp();

Page({
	data: {
		agentData: {},
		ImgHeadPath: '',
		defaultHeadImg: 'http://www.sinelinked.com/static/other/default_head.png',
		consultData: {
			name: '', //姓名
			tel: '', //电话
			c: '', //内容
			tel_token: '', //验证码
		},
		pointerEvent: false,
		sendTxt: '',
		city: '',
		iCode: '', //返回验证码
		team_id: '',
		scenes: '', //二级码参数
		account_id: '',
		xcx_title: '您的贴心保险顾问',
		region: ['广东省', '广州市', '海珠区'],
		customItem: '全部'
	},
	imageError: function (e) {
		var that = this
		if (e.target.id == "shareImageUrl") {
			var cMI = 'agentData.message.shareImageUrl'
			this.setData({
				[cMI]: 'http://www.sinelinked.com/static/other/pic-bg3.jpg',
				xcx_title: that.data.agentData.data[0].xcx_title
			})
		} else if (e.target.id == "ImgHeadPath") {
			//头像读取失败使用默认头像 
			var cMI = 'agentData.message.ImgHeadPath'
			this.setData({
				[cMI]: 'http://www.sinelinked.com/static/other/default_head.png'
			})
		}


	},
	navigatorTeam: function () {
		var that = this
		if (that.data.team_id) {
			wx.navigateTo({
				url: `/pages/pro-team/index/index?teamId=${that.data.team_id[0]}`
			})
		} else {
			wx.showToast({
				title: '未加入任何团队',
				icon: 'none',
				duration: 2000
			})
		}
	},
	makePhoneCall: function (phone) {
		var that = this
		wx.makePhoneCall({
			phoneNumber: that.data.agentData.data[0].phone //仅为示例，并非真实的电话号码
		})
	},
	bindRegionChange: function (e) {
		console.log('picker发送选择改变，携带值为', e.detail.value)
		this.setData({
			region: e.detail.value
		})
	},
	previewImages: function (e) {
		var that = this;
		console.log(that.data.ImgHeadPath);
		wx.previewImage({
			current: that.data.ImgHeadPath,
			urls: [that.data.ImgHeadPath],
			success: function () {

			}
		})
		wx.hideLoading()
	},
	goHome() {
		wx.reLaunch({
			url: '/pages/home/index/index',
			success: function () {
				console.log('home 跳转成功');
			},
			fail: function () {
				console.log('home 跳转失败');
			}
		})
	},

	onLoad: function (options) {
		console.log(options)
		var that = this
		app.editTabBarAgent()
		// 获取扫码状态下的用户id
		var scenes = decodeURIComponent(options.scene)
		var sceneAccount_id = scenes.split('=')[1]
		if (sceneAccount_id) {
			that.setData({
				scenes: sceneAccount_id
			})
			wx.setStorageSync('account_id', sceneAccount_id)
		}
		// 获取url参数如果没有获取本地储藏
		var account_idzf = options.account_id || wx.getStorageSync('account_id')
		if (account_idzf) {
			that.setData({
				account_id: account_idzf
			})
			wx.setStorageSync('account_id', account_idzf)
		}
	},
	onShow: function () {
		var that = this
		//  scenes存在情景下
		if (that.data.scenes) {
			wx.request({
				url: `https://www.sinelinked.com/agent/user/agent/person/search.sl`,
				data: {
					accountId: that.data.scenes
				},
				success: function (res) {
					var ImgHeadPath = res.data.message.ImgHeadPath + '?' + Math.random()
					that.setData({
						agentData: res.data,
						ImgHeadPath: ImgHeadPath,
						team_id: res.data.message.teamId,
						xcx_title: res.data.data[0].xcx_title
					})
					wx.hideLoading()
				}
			})
			// var account_idzf = options.query.account_id || wx.getStorageSync('account_id')
		} else if (that.data.account_id) {
			wx.request({
				url: `https://www.sinelinked.com/agent/user/agent/person/search.sl`,
				data: {
					accountId: that.data.account_id
				},
				success: function (res) {
					var ImgHeadPath = res.data.message.ImgHeadPath + '?' + Math.random()
					that.setData({
						agentData: res.data,
						ImgHeadPath: ImgHeadPath,
						team_id: res.data.message.teamId,
						xcx_title: res.data.data[0].xcx_title
					})
					wx.hideLoading()
				}
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
	// 提交咨询信息
	agentConsult: function (e) {
		var that = this;
		//验证验证码是否一致 
		if (that.data.consultData.tel_token != that.data.iCode) {
			wx.showModal({
				title: '提示',
				content: '验证码填写错误',
				showCancel: false,
				success: function (res) {}
			})
			return
		}

		var uid = e.currentTarget.dataset.id
		wx.request({
			url: 'https://www.sinelinked.com/agent/pm/caPublish.sl',
			header: {
				'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
			},
			data: {
				t: 1,
				n: that.data.consultData.name,
				tel: that.data.consultData.tel,
				uid: '保险顾问;' + uid,
				c: that.data.consultData.c,
				tel_token: that.data.consultData.tel_token,
				ca: 1,
				iCode: that.data.iCode
			},
			success: function (res) {
				console.log(res);
				if (res.data.error == 0) {
					wx.showModal({
						title: '提示',
						content: res.data.message,
						showCancel: false,
						success: function (res) {
							var namelStr = 'consultData.name'
							var telStr = 'consultData.tel'

							that.setData({
								[namelStr]: '',
								[telStr]: ''
							})
						}
					})
				} else {
					wx.showModal({
						title: '提示',
						content: res.data.message,
						showCancel: false,
						success: function (res) {}
					})
				}

			}
		})
	},
	// 发送验证码
	sendPhoneCode(e) {
		var that = this;
		wx.request({
			url: "https://www.sinelinked.com/agent/phone/message/send.sl",
			data: {
				phone: that.data.consultData.tel,
				flag: "code_8"
			},
			success: function (res) {
				console.log(res)
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
						iCode: res.data.message.iCode
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
	onShareAppMessage: function (res) {
		var that = this;
		// var image = new image()

		// console.log(image)
		return {
			// title: that.data.agentData.data[0].xcx_title || '您的贴心保险顾问',
			title: that.data.xcx_title,
			path: `/pages/agent/index/index?account_id=${that.data.agentData.data[0].id}`,
			imageUrl: that.data.agentData.message.shareImageUrl + '?' + Math.random(),
			success: function (res) {
				// 转发成功
			},
			fail: function (res) {
				// 转发失败
			}
		}
	}
})
