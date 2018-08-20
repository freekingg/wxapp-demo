// pages/show/show.js
//获取应用实例
var app = getApp();

Page({
  data: {
    agentShowData: {},
    imgProTeamPath:[],
    imgProTeamCoverPath:'',
    teamId:'',
    defaultHeadImg: 'http://www.sinelinked.com/static/other/default_head.png',
    xcx_title: '您的贴心保险顾问'
  },
	imageError: function(e) {
    var that = this;
    if (e.target.id == "shareImageUrl") {
      var cMI = 'agentData.message.shareImageUrl'
      this.setData({
        [cMI]: 'http://www.sinelinked.com/static/other/pic-bg3.jpg',
        xcx_title: that.data.agentShowData.data[0].pro_xcx_title
      })
    }else if(e.target.id == "ImgHeadPath"){
			var cMI = 'agentShowData.message.imgProTeamHeadPath'
			this.setData({
				[cMI]: 'http://www.sinelinked.com/static/other/default_head.png'
			})
		}
		
		if(e.target.id == "ImgSelfCoverPath"){
			var cMI2 = 'agentShowData.message.imgProTeamCoverPath'
			this.setData({
				[cMI2]: 'http://www.sinelinked.com/static/other/show-bg.jpg'
			})
		}
	},

  onLoad: function (options) {
    console.log('show,onLoad options', options)

    var that = this;

    app.editTabBarProTeam()
    wx.showLoading({
      title: '加载中',
      mask: true
    })

    if (options.teamId){
      that.setData({
        teamId: options.teamId
      })
    }
  },
  onShow(e){
    var that = this;
    // console.log('顾问团队身份进入')
    //获取 account_id
    var teamId = wx.getStorageSync('teamId')
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
            agentShowData: res.data,
            xcx_title: res.data.data[0].pro_xcx_title
          })

          // 防止图片缓存begin

          that.setData({
            imgProTeamCoverPath: res.data.message.imgProTeamCoverPath + '?' + Math.random()
          })
          var newImgSelfPath = []
          for (var i = 0; i < res.data.message.imgProTeamPath.length; i++) {
            newImgSelfPath.push(res.data.message.imgProTeamPath[i] + '?' + Math.random())
          }
          that.setData({
            imgProTeamPath: newImgSelfPath
          })
          // 防止图片缓存end

          wx.hideLoading()

        }
      })
    } else {
      var teamId = that.data.teamId
      if (teamId){
        wx.request({
          url: 'https://www.sinelinked.com/pro-team/user/proteam/info.sl',
          data: {
            accountId: teamId
          },
          success: function (res) {
            that.setData({
              agentShowData: res.data,
              xcx_title: res.data.data[0].pro_xcx_title
            })
            wx.setStorageSync('teamId', teamId)

            // 防止图片缓存begin

            that.setData({
              imgProTeamCoverPath: res.data.message.imgProTeamCoverPath + '?' + Math.random()
            })
            var newImgSelfPath = []
            for (var i = 0; i < res.data.message.imgProTeamPath.length; i++) {
              newImgSelfPath.push(res.data.message.imgProTeamPath[i] + '?' + Math.random())
            }
            that.setData({
              imgProTeamPath: newImgSelfPath
            })
            // 防止图片缓存end

            wx.hideLoading()

          }
        })
      }
     
    }
  },
  previewImages: function (e) {
    var that = this;
    wx.previewImage({
      current: e.currentTarget.dataset.item, 
      urls: that.data.imgProTeamPath
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    return {
      // title: that.data.agentShowData.data[0].pro_xcx_title || '您的贴心保险顾问',
      title: that.data.xcx_title,
      path: `/pages/pro-team/show/show?teamId=${that.data.teamId}`,
      imageUrl: that.data.agentShowData.message.shareImageUrl + '?' + Math.random(),
      success: function (res) {
        console.log(res)
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
})
