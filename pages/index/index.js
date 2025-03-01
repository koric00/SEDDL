import { TIERS, MESSAGES } from '../../utils/constants';
import conferenceService from '../../services/conferenceService';
import calendarService from '../../services/calendarService';

Page({
  data: {
    upcomingDeadlines: [],
    filteredDeadlines: [],
    loading: true,
    selectedTier: 'all',
    tiers: TIERS,
    dataSource: '本地数据',
    lastUpdated: '',
    error: null,
    currentSelectedItem: null
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    if (this.data.loading) {
      this.loadData();
    }
  },

  async loadData() {
    try {
      this.setData({ loading: true });
      console.log('加载会议数据...');
      
      // 获取会议数据
      const app = getApp();
      const conferences = app.globalData.conferences || [];
      console.log('获取到的会议数据:', conferences);
      
      if (!conferences || conferences.length === 0) {
        this.setData({
          loading: false,
          error: MESSAGES.NO_DATA
        });
        return;
      }
      
      // 获取即将到来的截止日期
      let upcomingDeadlines = await conferenceService.getUpcomingDeadlines(this.data.selectedTier);
      console.log('获取到的即将到来的截止日期:', upcomingDeadlines);
      
      // 确保会议开始日期的剩余天数正确
      upcomingDeadlines.forEach(deadline => {
        if (deadline.type === '会议开始' && deadline.daysLeft === null) {
          // 计算 2026-04-11 距离今天的天数
          const today = new Date();
          const conferenceDate = new Date('2026-04-11');
          const diffTime = conferenceDate - today;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          deadline.daysLeft = diffDays;
          console.log('修复会议开始剩余天数:', diffDays);
        }
      });
      
      // 重新排序
      upcomingDeadlines.sort((a, b) => a.daysLeft - b.daysLeft);
      
      this.setData({
        upcomingDeadlines,
        filteredDeadlines: upcomingDeadlines,
        loading: false,
        error: null,
        lastUpdated: new Date().toLocaleString()
      });
    } catch (error) {
      console.error('加载数据出错:', error);
      this.setData({
        loading: false,
        error: `加载数据出错: ${error.message}`
      });
    }
  },

  async addToCalendar(e) {
    try {
      const item = e.currentTarget.dataset.item;
      if (!item) {
        throw new Error(MESSAGES.INVALID_MEETING);
      }

      this.setData({ currentSelectedItem: item });

      const { tapIndex } = await wx.showActionSheet({
        itemList: ['添加到小程序日历', '添加到手机日历']
      });

      if (tapIndex === 0) {
        await this.addToMiniProgramCalendar();
      } else if (tapIndex === 1) {
        const { confirm } = await wx.showModal({
          title: '添加到手机日历',
          content: `确定要将 ${item.name} ${item.type} 添加到手机日历吗？`
        });

        if (confirm) {
          await this.addToPhoneCalendar();
        }
      }
    } catch (error) {
      if (error.errMsg !== 'showActionSheet:fail cancel') {
        wx.showToast({
          title: error.message || MESSAGES.CALENDAR_ADD_FAILED,
          icon: 'none'
        });
      }
    }
  },

  async addToPhoneCalendar() {
    try {
      const item = this.data.currentSelectedItem;
      if (!item || !item.deadline) {
        throw new Error(MESSAGES.INVALID_MEETING);
      }
      
      await calendarService.addToPhoneCalendar(item);
      wx.showToast({
        title: MESSAGES.CALENDAR_ADD_SUCCESS,
        icon: 'success'
      });
    } catch (error) {
      throw error;
    }
  },

  async addToMiniProgramCalendar() {
    try {
      const item = this.data.currentSelectedItem;
      if (!item || !item.deadline) {
        throw new Error(MESSAGES.INVALID_MEETING);
      }
      
      await calendarService.addToMiniProgramCalendar(item);
      wx.showToast({
        title: MESSAGES.CALENDAR_ADD_SUCCESS,
        icon: 'success'
      });
    } catch (error) {
      throw error;
    }
  },

  changeTier(e) {
    this.setData({ selectedTier: e.currentTarget.dataset.tier });
    this.loadData();
  },

  onPullDownRefresh() {
    this.loadData();
    wx.stopPullDownRefresh();
  },

  onShareAppMessage() {
    return {
      title: '软件工程会议截止日期',
      path: '/pages/index/index'
    };
  }
});
