class Conference {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.fullName = data.fullName;
    this.round1AbstractDeadline = data.round1AbstractDeadline;
    this.round1PaperDeadline = data.round1PaperDeadline;
    this.round1NotificationDate = data.round1NotificationDate;
    this.round2AbstractDeadline = data.round2AbstractDeadline;
    this.round2PaperDeadline = data.round2PaperDeadline;
    this.round2NotificationDate = data.round2NotificationDate;
    this.conferenceDate = data.conferenceDate;
    this.conferenceEndDate = data.conferenceEndDate;
    this.location = data.location;
    this.tier = data.tier;
    this.website = data.website;
    this.conferenceDaysLeft = data.conferenceDaysLeft;
  }

  getDisplayDate() {
    if (this.conferenceEndDate && this.conferenceEndDate !== this.conferenceDate) {
      return `${this.conferenceDate}~${this.conferenceEndDate}`;
    }
    return this.conferenceDate;
  }
}

export default Conference; 