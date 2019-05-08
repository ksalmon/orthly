// Test Data: NOTE: All in local time
const json = require('./data/test_data.json');

const {
  fromUnixTime, 
  getUnixTime,
  eachDayOfInterval, 
  addDays,
  isSameDay,
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
    start: new Date(),
    end: addDays(new Date(), defaultDayRange)
  });


  daysRange.forEach((d, i) => {
    schedules.forEach((s, i) => {
      const scheduleTimeSlots = []
      const dayHasSchedule = isSameDay(fromUnixTime(s.SchedDate), d, [])

      if (dayHasSchedule) {
        const existingAppointments = dayAppointments(s.SchedDate, appointments);
        const timeslots = generateTimeslots(60, msToTime(s.StartTime), msToTime(s.StopTime), fromUnixTime(s.SchedDate), bufferTime)
        
        timeslots.forEach(ts => {

          existingAppointments.forEach(a => {
            overlapping = areIntervalsOverlapping(
              { start: new Date(ts.start), end: new Date(ts.end)},
              { start: new Date(a.start), end: new Date(a.end) }
            )
        
            if (!overlapping){
              scheduleTimeSlots.push(getUnixTime(ts.start))
            }
          })
        })
        const ts = filter(scheduleTimeSlots)
        totalAvaliableTimeSlots.push({Ops: s.ProvNum, timeslots: ts})
      }
    })
  })

  console.log(totalAvaliableTimeSlots)
}


findTimes( json.appointments, json.operatories, json.schedules )