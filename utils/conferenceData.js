/**
 * 会议数据文件
 * 所有会议信息都集中在这里管理
 * 添加或更新会议时，只需修改此文件
 */

// 会议数据
const conferences = [
  {
    name: "ICSE 2026",
    fullName: "International Conference on Software Engineering",
    // 第一轮投稿
    round1AbstractDeadline: "2025-03-07",
    round1PaperDeadline: "2025-03-14",
    round1NotificationDate: "2025-06-20",
    // 第二轮投稿
    round2AbstractDeadline: "2025-07-11",
    round2PaperDeadline: "2025-07-18",
    round2NotificationDate: "2025-10-17",
    conferenceDate: "2026-04-11",
    location: "RIO DE JANEIRO, BRAZIL",
    website: "https://conf.researchr.org/home/icse-2026",
    tier: "A"
  }
  // 添加新会议的模板:
  /*
  {
    name: "会议简称 年份",
    fullName: "会议全称",
    // 如果是单轮投稿，使用以下字段
    abstractDeadline: "YYYY-MM-DD", // 摘要截止日期（如果有）
    paperDeadline: "YYYY-MM-DD",    // 论文截止日期
    notificationDate: "YYYY-MM-DD", // 通知日期
    // 如果是两轮投稿（如ICSE），使用以下字段
    round1AbstractDeadline: "YYYY-MM-DD", // 第一轮摘要截止日期
    round1PaperDeadline: "YYYY-MM-DD",    // 第一轮论文截止日期
    round1NotificationDate: "YYYY-MM-DD", // 第一轮通知日期
    round2AbstractDeadline: "YYYY-MM-DD", // 第二轮摘要截止日期
    round2PaperDeadline: "YYYY-MM-DD",    // 第二轮论文截止日期
    round2NotificationDate: "YYYY-MM-DD", // 第二轮通知日期
    // 会议信息
    conferenceDate: "YYYY-MM-DD~YYYY-MM-DD", // 会议日期（如果是单天，不需要~部分）
    location: "城市, 国家",                  // 会议地点
    website: "会议网站URL",                  // 会议网站
    tier: "A"                              // 会议等级：A、B或C
  }
  */
];

// 导出会议数据
module.exports = {
  getConferences: function() {
    return conferences;
  }
}; 