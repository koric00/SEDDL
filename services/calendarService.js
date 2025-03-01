import { STORAGE_KEYS, MESSAGES } from '../utils/constants';

class CalendarService {
  async addToPhoneCalendar(event) {
    try {
      if (!event || !event.deadline) {
        throw new Error(MESSAGES.INVALID_MEETING);
      }
      
      console.log('添加到手机日历:', event);
      
      const { startDate, endDate } = this.getEventDates(event.deadline);
      
      console.log('日历事件日期:', startDate, endDate);
      
      await wx.addPhoneCalendar({
        title: `${event.name} ${event.type}`,
        startTime: startDate.getTime(),
        endTime: endDate.getTime(),
        description: `${event.fullName} - ${event.type}`
      });
      
      return true;
    } catch (error) {
      console.error('添加到手机日历失败:', error);
      throw error;
    }
  }

  async addToMiniProgramCalendar(event) {
    try {
      if (!event || !event.deadline) {
        throw new Error(MESSAGES.INVALID_MEETING);
      }
      
      console.log('添加到小程序日历:', event);
      
      const savedEvents = wx.getStorageSync(STORAGE_KEYS.CALENDAR_EVENTS) || [];
      
      if (this.isEventExists(savedEvents, event)) {
        throw new Error(MESSAGES.EVENT_EXISTS);
      }

      savedEvents.push(event);
      wx.setStorageSync(STORAGE_KEYS.CALENDAR_EVENTS, savedEvents);
      
      return true;
    } catch (error) {
      console.error('添加到小程序日历失败:', error);
      throw error;
    }
  }

  getEventDates(deadline) {
    try {
      console.log('处理日期:', deadline);
      
      let startDate = deadline;
      let endDate = deadline;

      if (deadline.includes('~')) {
        const dates = deadline.split('~');
        startDate = dates[0];
        endDate = dates[1] || dates[0];
      }

      console.log('分割后的日期:', startDate, endDate);
      
      // 确保日期格式正确
      if (!startDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        console.error('开始日期格式不正确:', startDate);
        throw new Error('日期格式不正确');
      }
      
      if (!endDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        console.error('结束日期格式不正确:', endDate);
        throw new Error('日期格式不正确');
      }

      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59);

      return { startDate: start, endDate: end };
    } catch (error) {
      console.error('处理日期出错:', error, deadline);
      throw error;
    }
  }

  isEventExists(savedEvents, newEvent) {
    return savedEvents.some(event => 
      event.name === newEvent.name && 
      event.type === newEvent.type && 
      event.deadline === newEvent.deadline
    );
  }
}

export default new CalendarService(); 