# 软工顶会日历小程序

这是一个微信小程序，用于追踪软件工程领域顶级会议的截止日期（Deadline）。

## 功能特点

- 显示即将到来的会议截止日期，包括摘要截止、论文截止、通知日期和会议日期
- 按会议等级（A*、A、B、C）筛选会议
- 日历视图，直观展示每月的截止日期
- 点击日期查看详细信息
- 复制会议网址功能
- 支持下拉刷新更新数据

## 会议数据

目前包含以下软件工程领域的顶级会议：

- ICSE (International Conference on Software Engineering) - A*
- FSE (ACM Joint European Software Engineering Conference and Symposium on the Foundations of Software Engineering) - A*
- ASE (IEEE/ACM International Conference on Automated Software Engineering) - A
- ISSTA (International Symposium on Software Testing and Analysis) - A
- OOPSLA (Conference on Object-Oriented Programming Systems, Languages, and Applications) - A
- ICPC (IEEE International Conference on Program Comprehension) - B
- MSR (Mining Software Repositories) - B
- SANER (IEEE International Conference on Software Analysis, Evolution and Reengineering) - B

## 使用方法

1. 使用微信开发者工具打开项目
2. 在模拟器中预览或上传代码到微信小程序平台
3. 在首页可以查看即将到来的截止日期，并按会议等级筛选
4. 点击底部导航栏切换到日历视图，查看每月的截止日期
5. 在日历视图中，点击日期可以查看该日期的详细截止信息

## 项目结构

```
SEConf/
├── app.js                 # 应用程序逻辑
├── app.json               # 应用程序配置
├── app.wxss               # 应用程序样式
├── pages/                 # 页面文件夹
│   ├── index/             # 首页
│   │   ├── index.js       # 首页逻辑
│   │   ├── index.json     # 首页配置
│   │   ├── index.wxml     # 首页模板
│   │   └── index.wxss     # 首页样式
│   ├── calendar/          # 日历页面
│   │   ├── calendar.js    # 日历逻辑
│   │   ├── calendar.json  # 日历配置
│   │   ├── calendar.wxml  # 日历模板
│   │   └── calendar.wxss  # 日历样式
│   └── images/            # 图标文件夹
├── utils/                 # 工具函数
│   └── api.js             # API工具
└── project.config.json    # 项目配置文件
```

## 未来计划

- 添加更多软件工程领域的会议
- 支持自定义添加会议
- 添加提醒功能
- 支持从服务器获取最新会议数据
- 添加会议详情页面，展示更多信息

## 开发者

本项目由[您的名字]开发。

## 许可证

MIT 