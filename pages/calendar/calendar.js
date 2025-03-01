const api = require('../../utils/api.js')
const dateUtil = require('../../utils/dateUtil.js')

Page({
  data: {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    selectedDate: '',
    days: [],
    deadlines: [],
    selectedDeadlines: [],
    loading: true,
    monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    selectedDay: null,
    dayDeadlines: []
  },

  onLoad: function (options) {
    this.initCalendar()
  },

  onShow: function () {
    this.loadDeadlines()
  },

  // 初始化日历
  initCalendar: function () {
    const year = this.data.year;
    const month = this.data.month;
    
    // 计算当月天数
    const daysInMonth = new Date(year, month, 0).getDate();
    
    // 计算当月第一天是星期几
    const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
    
    // 生成日历数据
    let days = [];
    
    // 添加上个月的日期
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({
        day: null,
        isCurrentMonth: false
      });
    }
    
    // 添加当月的日期
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        isToday: this.isToday(year, month, i)
      });
    }
    
    this.setData({
      days: days
    });
    
    // 加载当月的截止日期
    this.loadDeadlines();
  },

  // 判断是否是今天
  isToday: function (year, month, day) {
    const today = new Date()
    return today.getFullYear() === year && today.getMonth() + 1 === month && today.getDate() === day
  },

  // 加载截止日期
  loadDeadlines: function() {
    const app = getApp();
    const conferences = app.globalData.conferences || [];
    
    // 获取当月的截止日期
    const deadlines = dateUtil.getDeadlinesForMonth(conferences, this.data.year, this.data.month);
    
    // 更新日历数据
    let days = this.data.days;
    
    deadlines.forEach(deadline => {
      const dayIndex = firstDayOfWeek + deadline.day - 1;
      if (days[dayIndex] && days[dayIndex].isCurrentMonth) {
        if (!days[dayIndex].hasDeadline) {
          days[dayIndex].hasDeadline = true;
        }
        if (!days[dayIndex].deadlineCount) {
          days[dayIndex].deadlineCount = 1;
        } else {
          days[dayIndex].deadlineCount++;
        }
      }
    });
    
    this.setData({
      days: days,
      deadlines: deadlines
    });
  },

  // 切换到上个月
  prevMonth: function () {
    let year = this.data.year
    let month = this.data.month - 1
    
    if (month < 1) {
      year--
      month = 12
    }
    
    this.setData({
      year: year,
      month: month,
      selectedDate: '',
      selectedDay: null,
      dayDeadlines: []
    })
    
    this.initCalendar()
  },

  // 切换到下个月
  nextMonth: function () {
    let year = this.data.year
    let month = this.data.month + 1
    
    if (month > 12) {
      year++
      month = 1
    }
    
    this.setData({
      year: year,
      month: month,
      selectedDate: '',
      selectedDay: null,
      dayDeadlines: []
    })
    
    this.initCalendar()
  },

  // 选择日期
  selectDay: function (e) {
    const index = e.currentTarget.dataset.index
    const day = this.data.days[index]
    
    if (!day.isCurrentMonth) {
      return
    }
    
    const selectedDay = day.day;
    
    // 筛选当天的截止日期
    const dayDeadlines = this.data.deadlines.filter(deadline => 
      deadline.day === selectedDay
    );
    
    this.setData({
      selectedDay: selectedDay,
      dayDeadlines: dayDeadlines
    })
  },

  // 复制会议网址
  copyWebsite: function (e) {
    const conferences = getApp().globalData.conferences
    const name = e.currentTarget.dataset.name
    const conference = conferences.find(conf => conf.name === name)
    
    if (conference && conference.website) {
      wx.setClipboardData({
        data: conference.website,
        success: function () {
          wx.showToast({
            title: '网址已复制',
            icon: 'success'
          })
        }
      })
    }
  },

  // 返回今天
  goToToday: function () {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth() + 1
    
    this.setData({
      year: year,
      month: month,
      selectedDate: ''
    })
    
    this.initCalendar()
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    this.initCalendar()
    wx.stopPullDownRefresh()
  },

  // 添加到手机日历
  addToPhoneCalendar: function (e) {
    const index = e.currentTarget.dataset.index;
    const deadline = this.data.dayDeadlines[index];
    
    // 格式化日期和时间
    const dateArr = deadline.date.split('-');
    const year = parseInt(dateArr[0]);
    const month = parseInt(dateArr[1]) - 1; // 月份从0开始
    const day = parseInt(dateArr[2]);
    
    // 创建日历事件
    wx.addPhoneCalendar({
      title: `${deadline.name} - ${deadline.type}`,
      startTime: new Date(year, month, day, 23, 59, 59).getTime(),
      endTime: new Date(year, month, day, 23, 59, 59).getTime(),
      description: `${deadline.fullName} - ${deadline.type}`,
      success: () => {
        wx.showToast({
          title: '已添加到日历',
          icon: 'success'
        });
      },
      fail: (err) => {
        console.error('添加日历失败', err);
        wx.showToast({
          title: '添加失败',
          icon: 'none'
        });
      }
    });
  },

  onShareAppMessage: function() {
    return {
      title: '软件工程会议截止日期 - 日历',
      path: '/pages/calendar/calendar'
    };
  }
})
