/**
 * 日期工具函数 - 简化版
 */

// 获取当前日期 YYYY-MM-DD
function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 计算两个日期之间的天数差
function getDaysDiff(dateStart, dateEnd) {
  // 使用 Date 构造函数创建日期对象
  const start = new Date(dateStart);
  const end = new Date(dateEnd);
  
  // 计算毫秒差并转换为天数
  const diffTime = end - start;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // 确保返回非负数
  return diffDays > 0 ? diffDays : 0;
}

// 获取即将到来的截止日期
function getUpcomingDeadlines(conferences, selectedTier = 'all') {
  const today = getCurrentDate();
  let upcoming = [];
  
  // 筛选会议
  let filteredConferences = conferences;
  if (selectedTier !== 'all') {
    filteredConferences = conferences.filter(conf => conf.tier === selectedTier);
  }
  
  // 处理每个会议的截止日期
  filteredConferences.forEach(conf => {
    // 第一轮摘要截止日期
    if (conf.round1AbstractDeadline && conf.round1AbstractDeadline >= today) {
      upcoming.push({
        id: conf.id || conf.name,
        name: conf.name,
        fullName: conf.fullName,
        deadline: conf.round1AbstractDeadline,
        type: '第一轮摘要截止',
        daysLeft: getDaysDiff(today, conf.round1AbstractDeadline),
        tier: conf.tier
      });
    }
    
    // 第一轮论文截止日期
    if (conf.round1PaperDeadline && conf.round1PaperDeadline >= today) {
      upcoming.push({
        id: conf.id || conf.name,
        name: conf.name,
        fullName: conf.fullName,
        deadline: conf.round1PaperDeadline,
        type: '第一轮论文截止',
        daysLeft: getDaysDiff(today, conf.round1PaperDeadline),
        tier: conf.tier
      });
    }
    
    // 第一轮通知日期
    if (conf.round1NotificationDate && conf.round1NotificationDate >= today) {
      upcoming.push({
        id: conf.id || conf.name,
        name: conf.name,
        fullName: conf.fullName,
        deadline: conf.round1NotificationDate,
        type: '第一轮通知',
        daysLeft: getDaysDiff(today, conf.round1NotificationDate),
        tier: conf.tier
      });
    }
    
    // 第二轮摘要截止日期
    if (conf.round2AbstractDeadline && conf.round2AbstractDeadline >= today) {
      upcoming.push({
        id: conf.id || conf.name,
        name: conf.name,
        fullName: conf.fullName,
        deadline: conf.round2AbstractDeadline,
        type: '第二轮摘要截止',
        daysLeft: getDaysDiff(today, conf.round2AbstractDeadline),
        tier: conf.tier
      });
    }
    
    // 第二轮论文截止日期
    if (conf.round2PaperDeadline && conf.round2PaperDeadline >= today) {
      upcoming.push({
        id: conf.id || conf.name,
        name: conf.name,
        fullName: conf.fullName,
        deadline: conf.round2PaperDeadline,
        type: '第二轮论文截止',
        daysLeft: getDaysDiff(today, conf.round2PaperDeadline),
        tier: conf.tier
      });
    }
    
    // 第二轮通知日期
    if (conf.round2NotificationDate && conf.round2NotificationDate >= today) {
      upcoming.push({
        id: conf.id || conf.name,
        name: conf.name,
        fullName: conf.fullName,
        deadline: conf.round2NotificationDate,
        type: '第二轮通知',
        daysLeft: getDaysDiff(today, conf.round2NotificationDate),
        tier: conf.tier
      });
    }
    
    // 会议开始日期 - 使用硬编码的剩余天数
    if (conf.conferenceDate && conf.conferenceDate >= today) {
      // 准备会议日期显示
      let displayDate = conf.conferenceDate;
      if (conf.conferenceEndDate && conf.conferenceEndDate !== conf.conferenceDate) {
        displayDate = `${conf.conferenceDate}~${conf.conferenceEndDate}`;
      }
      
      // 使用硬编码的剩余天数
      const daysLeft = conf.conferenceDaysLeft || 0;
      
      upcoming.push({
        id: conf.id || conf.name,
        name: conf.name,
        fullName: conf.fullName,
        deadline: displayDate,
        type: '会议开始',
        daysLeft: daysLeft,
        tier: conf.tier
      });
    }
  });
  
  // 按截止日期排序
  upcoming.sort((a, b) => a.daysLeft - b.daysLeft);
  
  return upcoming;
}

// 获取指定月份的截止日期
function getDeadlinesForMonth(conferences, year, month) {
  const monthStr = String(month).padStart(2, '0');
  const monthPrefix = `${year}-${monthStr}`;
  let deadlines = [];
  
  conferences.forEach(conf => {
    // 第一轮摘要截止日期
    if (conf.round1AbstractDeadline && conf.round1AbstractDeadline.startsWith(monthPrefix)) {
      const day = parseInt(conf.round1AbstractDeadline.split('-')[2]);
      deadlines.push({
        id: conf.id || conf.name,
        name: conf.name,
        fullName: conf.fullName,
        date: conf.round1AbstractDeadline,
        day: day,
        type: '第一轮摘要截止',
        tier: conf.tier
      });
    }
    
    // 第一轮论文截止日期
    if (conf.round1PaperDeadline && conf.round1PaperDeadline.startsWith(monthPrefix)) {
      const day = parseInt(conf.round1PaperDeadline.split('-')[2]);
      deadlines.push({
        id: conf.id || conf.name,
        name: conf.name,
        fullName: conf.fullName,
        date: conf.round1PaperDeadline,
        day: day,
        type: '第一轮论文截止',
        tier: conf.tier
      });
    }
    
    // 第一轮通知日期
    if (conf.round1NotificationDate && conf.round1NotificationDate.startsWith(monthPrefix)) {
      const day = parseInt(conf.round1NotificationDate.split('-')[2]);
      deadlines.push({
        id: conf.id || conf.name,
        name: conf.name,
        fullName: conf.fullName,
        date: conf.round1NotificationDate,
        day: day,
        type: '第一轮通知',
        tier: conf.tier
      });
    }
    
    // 第二轮摘要截止日期
    if (conf.round2AbstractDeadline && conf.round2AbstractDeadline.startsWith(monthPrefix)) {
      const day = parseInt(conf.round2AbstractDeadline.split('-')[2]);
      deadlines.push({
        id: conf.id || conf.name,
        name: conf.name,
        fullName: conf.fullName,
        date: conf.round2AbstractDeadline,
        day: day,
        type: '第二轮摘要截止',
        tier: conf.tier
      });
    }
    
    // 第二轮论文截止日期
    if (conf.round2PaperDeadline && conf.round2PaperDeadline.startsWith(monthPrefix)) {
      const day = parseInt(conf.round2PaperDeadline.split('-')[2]);
      deadlines.push({
        id: conf.id || conf.name,
        name: conf.name,
        fullName: conf.fullName,
        date: conf.round2PaperDeadline,
        day: day,
        type: '第二轮论文截止',
        tier: conf.tier
      });
    }
    
    // 第二轮通知日期
    if (conf.round2NotificationDate && conf.round2NotificationDate.startsWith(monthPrefix)) {
      const day = parseInt(conf.round2NotificationDate.split('-')[2]);
      deadlines.push({
        id: conf.id || conf.name,
        name: conf.name,
        fullName: conf.fullName,
        date: conf.round2NotificationDate,
        day: day,
        type: '第二轮通知',
        tier: conf.tier
      });
    }
    
    // 会议开始日期
    if (conf.conferenceDate && conf.conferenceDate.startsWith(monthPrefix)) {
      const day = parseInt(conf.conferenceDate.split('-')[2]);
      deadlines.push({
        id: conf.id || conf.name,
        name: conf.name,
        fullName: conf.fullName,
        date: conf.conferenceDate,
        day: day,
        type: '会议开始',
        tier: conf.tier
      });
    }
  });
  
  return deadlines;
}

module.exports = {
  getCurrentDate,
  getDaysDiff,
  getUpcomingDeadlines,
  getDeadlinesForMonth
}; 