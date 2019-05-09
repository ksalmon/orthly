const {
  fromUnixTime, 
  getUnixTime,
  eachDayOfInterval, 
  addDays,
  isSameDay,
  addMilliseconds
} = require('date-fns')

const msToTime = (duration) => {
  var minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  
  return hours + ":" + minutes;
}

const dayAppointments = (day, apts) => {
  const appointments = []
  apts.forEach(a => {
    const dayHasAppointments = isSameDay(fromUnixTime(a.AptDateTime),fromUnixTime(day), [])
    const startRange = fromUnixTime(a.AptDateTime)
    const endRange = addMilliseconds(startRange, a.Duration)
    if (dayHasAppointments) {
      const aptTimes = {
        start: startRange,
        end: endRange
      }
      appointments.push(aptTimes)
    }
  })

  return appointments;
}



const filter = (unavailableTimeSlots, scheduleTimeSlots) => {
  const filteredArray = scheduleTimeSlots.filter(function(x) { 
    return unavailableTimeSlots.indexOf(x) < 0;
  });

  return removeDuplicates(filteredArray)
}

const removeDuplicates = (ts) => ts.filter((v,i) => ts.indexOf(v) === i)

module.exports = {
  msToTime,
  dayAppointments,
  filter
};

