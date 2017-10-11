module.exports = class Duration {
  constructor(miliseconds) {
    this.duration = miliseconds
    this.milisecond = 1000
    this.second = 1000 * 60
    this.minute = 1000 * 60 * 60
  }
  
  get getTotalSeconds() {
    return this.duration / this.milisecond
  }
  
  get getTotalMinutes() {
    return this.duration / this.second
  }
  
  get getTotalHours() {
    return this.duration / this.minute
  }
  
  get getSeconds() {
    return Math.floor(this.getTotalSeconds) % 60
  }
  
  get getMinutes() {
    return Math.floor(this.getTotalMinutes) % 60
  }
  
  get getHours() {
    return Math.floor(this.getTotalHours) % 60
  }
}
