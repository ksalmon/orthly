/**
 * Generate an array of timeslots based on timeinterval
 * Assumption for brevity: 
 * - startTime and endTime are of valid time
 * - startTime will never be later than end time
 * 
 * @param  {integer} timeinterval   In mins. Can only accept 15, 30 or 60
 * @param  {string}  startTime      '03:45'. Min - '00:00', Max - '24:00'
 * @param  {string}  endTime        '15:00'. Min - '00:00', Max - '24:00'
 * @return {array}                  ['03:45', ....., '15:00']
 */

const generateTimeslots = (timeInterval, startTime, endTime) => {
  // Assert valid time interval.
  if (timeInterval < 15 || timeInterval > 60 || timeInterval % 15 !== 0) {
    throw new Error('Can only accept 15, 30, 60')
  }

  // Break down start and end hours/minutes.
  const [startHour, startMinute] = startTime.split(':')
  const endMinute = endTime.split(':')[1]

  // Check for interval validity with regards to start and end times.
  const validIntervalMap = {
    15: ['00', '15', '30', '45'],
    30: ['00', '30'],
    60: ['00'],
  }
  if (
    validIntervalMap[timeInterval].indexOf(startMinute) === -1 ||
    validIntervalMap[timeInterval].indexOf(endMinute) === -1
  ) {
    throw new Error('Incorrect time interval')
  }

  // Dumb time slot class.
  class Time {
    constructor (hour, minute) {
      this.hour = parseInt(hour, 10)
      this.minute = parseInt(minute, 10)
    }

    /**
     * Return formatted time as string of hour:minute
     *
     * @returns {string}
     */
    get () {

      let formatted = { hour: this.hour, minute: this.minute }
      for (let prop in formatted) {
        if (formatted[prop] < 10) {
          formatted[prop] = `0${formatted[prop]}`
        }
      }
      // console.log(`${formatted.hour}${formatted.minute}`)
      return `${formatted.hour}:${formatted.minute}`
    }

    /**
     * Add minutes to a time
     *
     * @param {number} minute
     * @returns {string}
     */
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

  // Instantiate start and end times
  const start = new Time(startHour, startMinute)
  // Add the first slot.
  const slots = [start.get()]

  // Keep adding slots until the expected end slot is reached.
  while (slots.lastIndexOf(endTime) === -1) {
    console.log(slots)
    slots.push(start.add(timeInterval))
  }

  return slots
}

module.exports = {
  generateTimeslots,
};


// =================================================================

// /**
//  * Tests
//  */
// const { expect } = window.chai
// mocha.setup('bdd')

// describe('#generateTimeslots', () => {
//   it('Rejects invalid interval', () => {
//     const func = () => generateTimeslots(5, '00:00', '24:00')
//     expect(func).to.throw('Can only accept 15, 30, 60')
//   })

//   it('Rejects incorrect time interval', () => {
//     const func = () => generateTimeslots(30, '08:15', '10:15')
//     expect(func).to.throw('Incorrect time interval')
//   })

//   it('Generates 15 min slots #1', () => {
//     const out = generateTimeslots(15, '08:45', '10:15')
//     expect(out).to.deep.equal(['08:45', '09:00', '09:15', '09:30', '09:45', '10:00', '10:15'])
//   })

//   it('Generates 15 min slots #2', () => {
//     const out = generateTimeslots(15, '13:15', '15:00')
//     expect(out).to.deep.equal(['13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00'])
//   })

//   it('Generates 30 min slots', () => {
//     const out = generateTimeslots(30, '08:00', '14:00')
//     expect(out).to.deep.equal(['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00'])
//   })

//   it('Generates 60 min slots', () => {
//     const out = generateTimeslots(60, '21:00', '24:00')
//     expect(out).to.deep.equal(['21:00', '22:00', '23:00', '24:00'])
//   })
// })

// mocha.run()
