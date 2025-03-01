import { DATE_FORMAT } from '../utils/constants';
import Conference from '../models/Conference';

class ConferenceService {
  constructor() {
    this.app = getApp();
  }

  async getConferences() {
    return this.app.globalData.conferences || [];
  }

  calculateDaysLeft(date) {
    try {
      const today = new Date();
      
      // 如果日期包含~，取第一个日期作为会议开始日期
      let targetDateStr = date;
      if (date && date.includes('~')) {
        targetDateStr = date.split('~')[0];
      }
      
      // 确保日期格式正确
      if (!targetDateStr || !targetDateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
        console.error('日期格式不正确:', targetDateStr);
        return null;
      }
      
      const targetDate = new Date(targetDateStr);
      const diffTime = targetDate - today;
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch (error) {
      console.error('计算剩余天数出错:', error, date);
      return null;
    }
  }

  async getUpcomingDeadlines(selectedTier = 'all') {
    const conferences = await this.getConferences();
    let upcoming = [];

    conferences.forEach(conf => {
      const conference = new Conference(conf);
      if (selectedTier !== 'all' && conference.tier !== selectedTier) {
        return;
      }

      this.addDeadlineIfUpcoming(upcoming, conference);
    });

    // 过滤掉daysLeft为null的项目
    upcoming = upcoming.filter(item => item.daysLeft !== null);
    
    return upcoming.sort((a, b) => a.daysLeft - b.daysLeft);
  }

  addDeadlineIfUpcoming(upcoming, conference) {
    const deadlines = [
      { date: conference.round1AbstractDeadline, type: '第一轮摘要截止' },
      { date: conference.round1PaperDeadline, type: '第一轮论文截止' },
      { date: conference.round1NotificationDate, type: '第一轮通知' },
      { date: conference.round2AbstractDeadline, type: '第二轮摘要截止' },
      { date: conference.round2PaperDeadline, type: '第二轮论文截止' },
      { date: conference.round2NotificationDate, type: '第二轮通知' },
      { date: conference.conferenceDate, type: '会议开始' }
    ];

    deadlines.forEach(({ date, type }) => {
      if (date && this.isUpcoming(date)) {
        // 计算剩余天数
        let daysLeft = this.calculateDaysLeft(date);
        
        // 如果是会议开始日期，并且原始数据中有conferenceDaysLeft，则使用它
        if (type === '会议开始' && conference.conferenceDaysLeft !== undefined) {
          daysLeft = conference.conferenceDaysLeft;
        }
        
        upcoming.push({
          id: conference.id,
          name: conference.name,
          fullName: conference.fullName,
          deadline: type === '会议开始' ? conference.getDisplayDate() : date,
          type: type,
          daysLeft: daysLeft,
          tier: conference.tier
        });
      }
    });
  }

  isUpcoming(date) {
    try {
      // 如果日期包含~，取第一个日期作为会议开始日期
      let dateStr = date;
      if (date && date.includes('~')) {
        dateStr = date.split('~')[0];
      }
      
      const today = new Date().toISOString().split('T')[0];
      return dateStr >= today;
    } catch (error) {
      console.error('检查日期是否即将到来出错:', error, date);
      return false;
    }
  }
}

export default new ConferenceService(); 