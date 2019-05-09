const generateTimeslots = (timeInterval, startTime, endTime, date, buffer) => {
  if (timeInterval < 15 || timeInterval > 60 || timeInterval % 15 !== 0) {
    throw new Error('Can only accept 15, 30, 60')
  }
  const formattedSlots = []

  const [startHour, startMinute] = startTime.split(':')
  const endMinute = endTime.split(':')[1]

  const validIntervalMap = {
    30: ['00', '30'],
    60: ['00'],
  }

  if (
    validIntervalMap[timeInterval].indexOf(startMinute) === -1 ||
    validIntervalMap[timeInterval].indexOf(endMinute) === -1
  ) {
    throw new Error('Incorrect time interval')
  }

  class Time {
    constructor (hour, minute) {
      this.hour = parseInt(hour, 10)
      this.minute = parseInt(minute, 10)
    }

    get () {
      let formatted = { hour: this.hour, minute: this.minute }
      for (let prop in formatted) {
        if (formatted[prop] < 10) {
          formatted[prop] = `0${formatted[prop]}`
        }
      }
      formatRange(formatted.hour, formatted.minute, date)
      return `${formatted.hour}:${formatted.minute}`
    }

    add (minute) {
      const newMinute = this.minute + minute
      if (newMinute >= 60) {
        this.hour += parseInt(newMinute / 60, 10)
        this.minute = newMinute % 60
      } else {
        this.minute = newMinute
      }

      return this.get()
    }
  }

  const formatRange = (hour, min, date) => {
    const startHour = dateAdd(date, "hour", hour)
    const startMins = dateAdd(startHour, "minute", min)
    const startRange = startMins
    const endRange = dateAdd(startHour, "hour", 1)

    const slotTimes = {
      start: startRange,
      end: dateAdd(endRange, "minute", buffer)
    }

    formattedSlots.push(slotTimes)
  }

  const start = new Time(startHour, startMinute)
  const slots = [start.get()]

  while (slots.lastIndexOf(endTime) === -1) {
    slots.push(start.add(timeInterval))
  }

  return formattedSlots
}


const dateAdd = (date, interval, units) => {
  var ret = new Date(date); 
  var checkRollover = function() { if(ret.getDate() != date.getDate()) ret.setDate(0);};
  switch(interval.toLowerCase()) {
    case 'hour'   :  ret.setTime(ret.getTime() + units*3600000);  break;
    case 'minute' :  ret.setTime(ret.getTime() + units*60000);  break;
    default       :  ret = undefined;  break;
  }
  return ret;
}

module.exports = {
  generateTimeslots,
};
