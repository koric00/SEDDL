// app.js
const api = require('./utils/api.js')
const conferenceData = require('./utils/conferenceData.js')

// 只引入会议数据
const conferences = require('./utils/conferences.js');

App({
  onLaunch: function () {
    // 计算 2026-04-11 距离今天的天数
    const today = new Date();
    const conferenceDate = new Date('2026-04-11');
    const diffTime = conferenceDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // 初始化会议数据 - 直接包含剩余天数
    this.globalData.conferences = [{
      id: "icse2026",
      name: "ICSE 2026",
      fullName: "International Conference on Software Engineering",
      round1AbstractDeadline: "2025-03-07",
      round1PaperDeadline: "2025-03-14",
      round1NotificationDate: "2025-06-20",
      round2AbstractDeadline: "2025-07-11",
      round2PaperDeadline: "2025-07-18",
      round2NotificationDate: "2025-10-17",
      conferenceDate: "2026-04-11",
      conferenceEndDate: "2026-04-18",
      location: "RIO DE JANEIRO, BRAZIL",
      tier: "A",
      website: "https://conf.researchr.org/home/icse-2026",
      // 直接添加剩余天数
      conferenceDaysLeft: diffDays
    }];
    
    console.log('会议开始剩余天数:', diffDays);

    // 打印会议数据进行调试
    console.log('会议数据:', JSON.stringify(this.globalData.conferences, null, 2));

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    // 加载会议数据
    this.loadConferenceData()

    // 验证日期格式
    this.globalData.conferences.forEach(conf => {
      console.log('验证会议日期:', conf.name);
      
      // 验证日期格式函数
      const validateDate = (date, fieldName) => {
        if (!date) return;
        
        // 检查日期格式是否为 YYYY-MM-DD
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(date)) {
          console.error(`会议 ${conf.name} 的 ${fieldName} 格式不正确:`, date);
          // 尝试修复日期格式
          const fixedDate = this.fixDateFormat(date);
          if (fixedDate !== date) {
            console.log(`已修复 ${fieldName} 为:`, fixedDate);
            conf[fieldName] = fixedDate;
          }
        }
      };
      
      // 验证所有日期字段
      validateDate(conf.round1AbstractDeadline, 'round1AbstractDeadline');
      validateDate(conf.round1PaperDeadline, 'round1PaperDeadline');
      validateDate(conf.round1NotificationDate, 'round1NotificationDate');
      validateDate(conf.round2AbstractDeadline, 'round2AbstractDeadline');
      validateDate(conf.round2PaperDeadline, 'round2PaperDeadline');
      validateDate(conf.round2NotificationDate, 'round2NotificationDate');
      validateDate(conf.conferenceDate, 'conferenceDate');
    });
  },

  // 加载会议数据
  loadConferenceData: function() {
    // 尝试从API获取实时数据
    this.fetchRealTimeData().catch(err => {
      console.error('获取实时数据失败，使用本地数据', err);
      this.loadLocalData();
    });
  },

  // 尝试从API获取实时会议数据
  fetchRealTimeData: function() {
    return new Promise((resolve, reject) => {
      api.fetchConferenceData()
        .then(data => {
          if (data && data.length > 0) {
            this.globalData.conferences = data
            this.globalData.dataSource = 'remote'
            resolve(data)
          } else {
            reject(new Error('获取的数据为空'))
          }
        })
        .catch(err => {
          reject(err)
        })
    })
  },

  // 加载本地数据
  loadLocalData: function() {
    // 计算 2026-04-11 距离今天的天数
    const today = new Date();
    const conferenceDate = new Date('2026-04-11');
    const diffTime = conferenceDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    this.globalData.conferences = [
      {
        id: "icse2026",
        name: "ICSE 2026",
        fullName: "International Conference on Software Engineering",
        round1AbstractDeadline: "2025-03-07",
        round1PaperDeadline: "2025-03-14",
        round1NotificationDate: "2025-06-20",
        round2AbstractDeadline: "2025-07-11",
        round2PaperDeadline: "2025-07-18",
        round2NotificationDate: "2025-10-17",
        conferenceDate: "2026-04-11",
        conferenceEndDate: "2026-04-18",
        location: "RIO DE JANEIRO, BRAZIL",
        website: "https://conf.researchr.org/home/icse-2026",
        tier: "A",
        conferenceDaysLeft: diffDays
      }
    ];
    console.log('已加载本地会议数据', this.globalData.conferences);
    this.globalData.dataSource = 'local'
  },

  // 获取特定会议的最新信息
  fetchSpecificConference: function(conferenceName) {
    return new Promise((resolve, reject) => {
      api.fetchFromWikiCFP(conferenceName)
        .then(data => {
          if (data) {
            // 更新全局会议数据中的特定会议
            const index = this.globalData.conferences.findIndex(conf => conf.name === conferenceName)
            if (index !== -1) {
              this.globalData.conferences[index] = { ...this.globalData.conferences[index], ...data }
            } else {
              this.globalData.conferences.push(data)
            }
            resolve(data)
          } else {
            reject(new Error('获取的特定会议数据为空'))
          }
        })
        .catch(err => {
          reject(err)
        })
    })
  },

  // 修复日期格式的函数
  fixDateFormat: function(dateStr) {
    if (!dateStr) return dateStr;
    
    // 尝试修复常见的日期格式问题
    // 例如: 2026/04/11 -> 2026-04-11
    dateStr = dateStr.replace(/\//g, '-');
    
    // 确保月份和日期是两位数
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const month = parts[1].padStart(2, '0');
      const day = parts[2].padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    
    return dateStr;
  },

  globalData: {
    userInfo: null,
    conferences: [],
    dataSource: 'none' // 'remote', 'local', or 'none'
  }
})
