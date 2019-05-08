// Test Data: NOTE: All in local time
const json = require('./data/test_data.json');

const {
  isWithinRange, 
  fromUnixTime, 
  getUnixTime,
  eachDayOfInterval, 
  addDays,
  isSameDay
} = require('date-fns')

// Utility Helpers
const { generateTimeslots } = require('./util/timeslots.js');
const { msToTime } = require('./util/timeHelpers.js');

const findTimes = (appointments, operatories, schedules) => {
  const bufferTime = 30000
        appointmentDuration = 60
        defaultDayRange = 10
        avaliableTimeSlots = []

  const daysRange = eachDayOfInterval({
    start: new Date(),
    end: addDays(new Date(), defaultDayRange)
  });


  daysRange.forEach((d, i) => {
    schedules.forEach((s, i) => {
      const dayHasSchedule = isSameDay(fromUnixTime(s.SchedDate), d, [])

      if (dayHasSchedule) {
        const existingAppointments = dayAppointments(s.SchedDate, appointments);
        const timeslots = generateTimeslots(60, msToTime(s.StartTime), msToTime(s.StopTime))
        // const formattedTimeslots = formatTimeslots(timeslots, fromUnixTime(s.SchedDate), bufferTime)
        
      }
    })
  });
}

const dayAppointments = (day, apts) => {
  const appointments = []

  apts.forEach(a => {
    const dayHasAppointments = isSameDay(fromUnixTime(a.AptDateTime),fromUnixTime(day), [])
    if (dayHasAppointments) {
      const aptTimes = {
        start: fromUnixTime(a.AptDateTime),
        end: fromUnixTime(a.AptDateTime + a.Duration)
      }
      appointments.push(aptTimes)
    }
  })

  return appointments;
}

// const formatTimeslots = (timeslots, date, buffer) => {
//   const timeslots = []

//   time.forEach(ts => {
//     const dayHasAppointments = isSameDay(fromUnixTime(a.AptDateTime),fromUnixTime(day), [])
//     if (dayHasAppointments) {
//       const aptTimes = {
//         startTime: fromUnixTime(a.AptDateTime),
//         stopTime: fromUnixTime(a.AptDateTime + a.Duration)
//       }
//       appointments.push(aptTimes)
//     }
//   })

//   return timeslots;
// }

findTimes( json.appointments, json.operatories, json.schedules )