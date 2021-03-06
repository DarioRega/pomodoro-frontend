import moment from 'moment-timezone'

export const getRandomNumber = () => Math.floor(Math.random() * 99999)

export const extractErrorValues = (errors) => {
  let errorList = ''
  Object.keys(errors).forEach((x) => {
    errors[x].forEach((y) => {
      errorList += `<li>${y}</li>`
    })
  })
  return errorList
}

export const secondsRemainingToTheCurrentMinute = () =>
  (60 - moment().seconds()) * 1000
