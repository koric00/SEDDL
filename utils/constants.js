// 会议等级配置
export const TIERS = [
  { value: 'all', text: '全部' },
  { value: 'A', text: 'A' },
  { value: 'B', text: 'B' },
  { value: 'C', text: 'C' }
];

// 日期格式
export const DATE_FORMAT = 'YYYY-MM-DD';

// 存储键
export const STORAGE_KEYS = {
  CALENDAR_EVENTS: 'calendarEvents'
};

// 消息提示
export const MESSAGES = {
  NO_DATA: '没有会议数据',
  DATA_UPDATED: '数据已更新',
  FETCH_FAILED: '获取数据失败',
  INVALID_MEETING: '无效的会议数据',
  CALENDAR_ADD_SUCCESS: '已添加到日历',
  CALENDAR_ADD_FAILED: '添加失败',
  EVENT_EXISTS: '该事件已在日历中'
}; 