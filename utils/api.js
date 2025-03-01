/**
 * 格式化日期为 YYYY-MM-DD
 * @param {Date} date 日期对象
 * @return {string} 格式化后的日期字符串
 */
const formatDate = (date) => {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 计算两个日期之间的天数差
 * @param {string} date1 日期字符串 YYYY-MM-DD
 * @param {string} date2 日期字符串 YYYY-MM-DD
 * @return {number} 天数差
 */
const getDaysDiff = (date1, date2) => {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  const diffTime = Math.abs(d2 - d1)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

/**
 * 获取当前日期字符串
 * @return {string} 当前日期字符串 YYYY-MM-DD
 */
const getCurrentDate = () => {
  return formatDate(new Date())
}

/**
 * 获取即将到来的截止日期
 * @param {Array} conferences 会议数据数组
 * @return {Array} 按截止日期排序的会议数组
 */
const getUpcomingDeadlines = (conferences) => {
  const today = getCurrentDate()
  console.log('当前日期:', today)
  
  if (!conferences || conferences.length === 0) {
    console.log('没有会议数据')
    return []
  }
  
  let upcoming = []
  
  conferences.forEach(conf => {
    // 简化处理，只关注主要截止日期
    if (conf.round1PaperDeadline && conf.round1PaperDeadline >= today) {
      upcoming.push({
        name: conf.name,
        fullName: conf.fullName,
        deadline: conf.round1PaperDeadline,
        type: '第一轮论文截止',
        daysLeft: getDaysDiff(today, conf.round1PaperDeadline),
        tier: conf.tier
      })
    }
    
    if (conf.round2PaperDeadline && conf.round2PaperDeadline >= today) {
      upcoming.push({
        name: conf.name,
        fullName: conf.fullName,
        deadline: conf.round2PaperDeadline,
        type: '第二轮论文截止',
        daysLeft: getDaysDiff(today, conf.round2PaperDeadline),
        tier: conf.tier
      })
    }
    
    // 如果是单轮会议
    if (conf.paperDeadline && conf.paperDeadline >= today) {
      upcoming.push({
        name: conf.name,
        fullName: conf.fullName,
        deadline: conf.paperDeadline,
        type: '论文截止',
        daysLeft: getDaysDiff(today, conf.paperDeadline),
        tier: conf.tier
      })
    }
  })
  
  // 按截止日期排序
  upcoming.sort((a, b) => a.daysLeft - b.daysLeft)
  
  return upcoming
}

/**
 * 获取指定月份的所有截止日期
 * @param {Array} conferences 会议数据数组
 * @param {number} year 年份
 * @param {number} month 月份（1-12）
 * @return {Array} 该月的所有截止日期
 */
const getDeadlinesForMonth = (conferences, year, month) => {
  const deadlines = []
  const monthStr = month.toString().padStart(2, '0')
  
  conferences.forEach(conf => {
    // 检查是否是两轮投稿的会议（如ICSE）
    const hasTwoRounds = conf.round1AbstractDeadline || conf.round1PaperDeadline
    
    if (hasTwoRounds) {
      // 处理两轮投稿的会议
      
      // 第一轮摘要截止日期
      if (conf.round1AbstractDeadline && conf.round1AbstractDeadline.startsWith(`${year}-${monthStr}`)) {
        const day = parseInt(conf.round1AbstractDeadline.split('-')[2])
        deadlines.push({
          name: conf.name,
          fullName: conf.fullName,
          date: conf.round1AbstractDeadline,
          day: day,
          type: '第一轮摘要截止',
          tier: conf.tier
        })
      }

      // 第一轮论文截止日期
      if (conf.round1PaperDeadline && conf.round1PaperDeadline.startsWith(`${year}-${monthStr}`)) {
        const day = parseInt(conf.round1PaperDeadline.split('-')[2])
        deadlines.push({
          name: conf.name,
          fullName: conf.fullName,
          date: conf.round1PaperDeadline,
          day: day,
          type: '第一轮论文截止',
          tier: conf.tier
        })
      }

      // 第一轮通知日期
      if (conf.round1NotificationDate && conf.round1NotificationDate.startsWith(`${year}-${monthStr}`)) {
        const day = parseInt(conf.round1NotificationDate.split('-')[2])
        deadlines.push({
          name: conf.name,
          fullName: conf.fullName,
          date: conf.round1NotificationDate,
          day: day,
          type: '第一轮通知日期',
          tier: conf.tier
        })
      }

      // 第二轮摘要截止日期
      if (conf.round2AbstractDeadline && conf.round2AbstractDeadline.startsWith(`${year}-${monthStr}`)) {
        const day = parseInt(conf.round2AbstractDeadline.split('-')[2])
        deadlines.push({
          name: conf.name,
          fullName: conf.fullName,
          date: conf.round2AbstractDeadline,
          day: day,
          type: '第二轮摘要截止',
          tier: conf.tier
        })
      }

      // 第二轮论文截止日期
      if (conf.round2PaperDeadline && conf.round2PaperDeadline.startsWith(`${year}-${monthStr}`)) {
        const day = parseInt(conf.round2PaperDeadline.split('-')[2])
        deadlines.push({
          name: conf.name,
          fullName: conf.fullName,
          date: conf.round2PaperDeadline,
          day: day,
          type: '第二轮论文截止',
          tier: conf.tier
        })
      }

      // 第二轮通知日期
      if (conf.round2NotificationDate && conf.round2NotificationDate.startsWith(`${year}-${monthStr}`)) {
        const day = parseInt(conf.round2NotificationDate.split('-')[2])
        deadlines.push({
          name: conf.name,
          fullName: conf.fullName,
          date: conf.round2NotificationDate,
          day: day,
          type: '第二轮通知日期',
          tier: conf.tier
        })
      }
    } else {
      // 处理单轮投稿的会议
      
      // 检查摘要截止日期
      if (conf.abstractDeadline && conf.abstractDeadline.startsWith(`${year}-${monthStr}`)) {
        const day = parseInt(conf.abstractDeadline.split('-')[2])
        deadlines.push({
          name: conf.name,
          fullName: conf.fullName,
          date: conf.abstractDeadline,
          day: day,
          type: '摘要截止',
          tier: conf.tier
        })
      }

      // 检查论文截止日期
      if (conf.paperDeadline && conf.paperDeadline.startsWith(`${year}-${monthStr}`)) {
        const day = parseInt(conf.paperDeadline.split('-')[2])
        deadlines.push({
          name: conf.name,
          fullName: conf.fullName,
          date: conf.paperDeadline,
          day: day,
          type: '论文截止',
          tier: conf.tier
        })
      }
    }

    // 检查通知日期
    if (conf.notificationDate && conf.notificationDate.startsWith(`${year}-${monthStr}`)) {
      const day = parseInt(conf.notificationDate.split('-')[2])
      deadlines.push({
        name: conf.name,
        fullName: conf.fullName,
        date: conf.notificationDate,
        day: day,
        type: '通知日期',
        tier: conf.tier
      })
    }

    // 检查会议日期
    if (conf.conferenceDate) {
      // 处理会议日期范围格式 (2026-04-11~2026-04-18)
      let confDates = conf.conferenceDate.split('~')
      let startDate = confDates[0]
      let endDate = confDates.length > 1 ? confDates[1] : startDate
      
      if (startDate.startsWith(`${year}-${monthStr}`)) {
        const day = parseInt(startDate.split('-')[2])
        deadlines.push({
          name: conf.name,
          fullName: conf.fullName,
          date: startDate,
          day: day,
          type: '会议开始',
          tier: conf.tier
        })
      }
      
      if (endDate !== startDate && endDate.startsWith(`${year}-${monthStr}`)) {
        const day = parseInt(endDate.split('-')[2])
        deadlines.push({
          name: conf.name,
          fullName: conf.fullName,
          date: endDate,
          day: day,
          type: '会议结束',
          tier: conf.tier
        })
      }
    }
  })

  return deadlines
}

/**
 * 按等级过滤会议
 * @param {Array} conferences 会议数据数组
 * @param {string} tier 会议等级
 * @return {Array} 过滤后的会议数组
 */
const filterConferencesByTier = (conferences, tier) => {
  if (!tier) return conferences
  return conferences.filter(conf => conf.tier === tier)
}

// 实时获取会议数据
const fetchConferenceData = function() {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://api.example.com/conferences', // 替换为实际的API端点
      method: 'GET',
      success: function(res) {
        if (res.statusCode === 200) {
          console.log('成功获取会议数据:', res.data)
          resolve(res.data)
        } else {
          console.error('获取会议数据失败:', res.statusCode)
          reject(new Error('获取会议数据失败: ' + res.statusCode))
        }
      },
      fail: function(err) {
        console.error('请求失败:', err)
        reject(err)
      }
    })
  })
}

// 从WikiCFP获取会议信息
const fetchFromWikiCFP = function(conferenceName) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `https://api.example.com/wikicfp/search?q=${encodeURIComponent(conferenceName)}`,
      method: 'GET',
      success: function(res) {
        if (res.statusCode === 200) {
          console.log(`成功从WikiCFP获取${conferenceName}信息:`, res.data)
          resolve(res.data)
        } else {
          console.error(`从WikiCFP获取${conferenceName}信息失败:`, res.statusCode)
          reject(new Error(`从WikiCFP获取${conferenceName}信息失败: ` + res.statusCode))
        }
      },
      fail: function(err) {
        console.error('请求失败:', err)
        reject(err)
      }
    })
  })
}

module.exports = {
  formatDate,
  getDaysDiff,
  getCurrentDate,
  getUpcomingDeadlines,
  getDeadlinesForMonth,
  filterConferencesByTier,
  fetchConferenceData: fetchConferenceData,
  fetchFromWikiCFP: fetchFromWikiCFP
}
