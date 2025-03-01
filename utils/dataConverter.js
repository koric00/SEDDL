/**
 * 数据转换工具
 * 将旧格式的会议数据转换为新格式
 */

function convertToNewFormat(oldData) {
  return oldData.map(conf => {
    // 创建新的会议对象
    const newConf = {
      id: conf.id || conf.name,
      name: conf.name,
      fullName: conf.fullName,
      deadlines: [],
      conferenceDate: conf.conferenceDate,
      conferenceEndDate: conf.conferenceEndDate,
      location: conf.location,
      website: conf.website,
      tier: conf.tier
    };
    
    // 添加截止日期
    if (conf.round1AbstractDeadline) {
      newConf.deadlines.push({
        type: '第一轮摘要截止',
        date: conf.round1AbstractDeadline
      });
    }
    
    if (conf.round1PaperDeadline) {
      newConf.deadlines.push({
        type: '第一轮论文截止',
        date: conf.round1PaperDeadline
      });
    }
    
    if (conf.round1NotificationDate) {
      newConf.deadlines.push({
        type: '第一轮通知',
        date: conf.round1NotificationDate
      });
    }
    
    if (conf.round2AbstractDeadline) {
      newConf.deadlines.push({
        type: '第二轮摘要截止',
        date: conf.round2AbstractDeadline
      });
    }
    
    if (conf.round2PaperDeadline) {
      newConf.deadlines.push({
        type: '第二轮论文截止',
        date: conf.round2PaperDeadline
      });
    }
    
    if (conf.round2NotificationDate) {
      newConf.deadlines.push({
        type: '第二轮通知',
        date: conf.round2NotificationDate
      });
    }
    
    if (conf.abstractDeadline) {
      newConf.deadlines.push({
        type: '摘要截止',
        date: conf.abstractDeadline
      });
    }
    
    if (conf.paperDeadline) {
      newConf.deadlines.push({
        type: '论文截止',
        date: conf.paperDeadline
      });
    }
    
    if (conf.notificationDate) {
      newConf.deadlines.push({
        type: '通知日期',
        date: conf.notificationDate
      });
    }
    
    return newConf;
  });
}

module.exports = {
  convertToNewFormat
}; 