// Test Data: NOTE: All in local time
const json = require('./data/test_data.json');

const {
  fromUnixTime, 
  getUnixTime,
  eachDayOfInterval, 
  addDays,
  isSameDay,
  setHours,
  areIntervalsOverlapping
} = require('date-fns')

// Utility Helpers
const { generateTimeslots } = require('./util/timeslots.js');
const { msToTime, dayAppointments, filter } = require('./util/timeHelpers.js');

const findTimes = (appointments, operatories, schedules) => {
  const bufferTime = 30
        appointmentDuration = 60
        defaultDayRange = 10
        totalAvaliableTimeSlots = []

  const daysRange = eachDayOfInterval({
    start: new Date().setHours(0),
    end: addDays(new Date().setHours( 0), defaultDayRange)
  });


  daysRange.forEach((d, i) => {
    schedules.forEach((s, i) => {
      const dayHasSchedule = isSameDay(fromUnixTime(s.SchedDate), d, [])
      const unavailableTimeSlots = []
      const scheduleTimeSlots = []

      if (dayHasSchedule) {
        const existingAppointments = dayAppointments(s.SchedDate, appointments);
        const timeslots = generateTimeslots(60, msToTime(s.StartTime), msToTime(s.StopTime), fromUnixTime(s.SchedDate), bufferTime)
        
        existingAppointments.forEach(a => {
          if (existingAppointments.length == 0) {
            scheduleTimeSlots.push(getUnixTime(ts.start))
          } else {
            timeslots.forEach(ts => {
              overlapping = areIntervalsOverlapping(
                { start: new Date(a.start), end: new Date(a.end)},
                { start: new Date(ts.start), end: new Date(ts.end)}
              )
              if (overlapping){
                unavailableTimeSlots.push(getUnixTime(ts.start))
              } else {
                scheduleTimeSlots.push(getUnixTime(ts.start))
              }
            })
          }
        })

        const ts = filter(unavailableTimeSlots, scheduleTimeSlots)
        totalAvaliableTimeSlots.push({Ops: s.ProvNum, timeslots: ts})
      }
    })
  })

  console.log(totalAvaliableTimeSlots)
  return totalAvaliableTimeSlots
}

findTimes( json.appointments, json.operatories, json.schedules )