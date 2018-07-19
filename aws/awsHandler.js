const AWS = require('aws-sdk')
const uuid = require('uuid')

require('dotenv').config()

// Set the region
AWS.config.update({ region: 'eu-central-1' })

// Create EC2 service object
let ec2 = new AWS.EC2({ apiVersion: '2016-11-15' })
// let ec2 = new AWS.EC2()

let stopTimeout

let params = {
  InstanceIds: [process.env.AWS_MINECRAFT_INSTANCE_ID]
}

exports.describe = function () {
  return new Promise((resolve, reject) => {
    ec2.describeInstances(params, function (err, data) {
      if (err) {
        console.log('Error', err.stack)
        reject(err)
      } else {
        console.log('Success', JSON.stringify(data))
        resolve(data)
      }
    })
  })
}


exports.start = function (duration) {
  clearTimeout(stopTimeout)

  if (duration) {
    stopTimeout = setTimeout(()=> {
      ec2.stopInstances(params, () =>{

      })
    }, duration)
  }

  return new Promise((resolve, reject) => {
    ec2.startInstances(params, function (err, data) {
      if (err) {
        console.log('Error', err.stack)
        reject(err)
      } else {
        console.log('Success', JSON.stringify(data))
        resolve(data)
      }
    })
  })
}

exports.stop = function () {
  return new Promise((resolve, reject) => {
    ec2.stopInstances(params, function (err, data) {
      if (err) {
        console.log('Error', err.stack)
        reject(err)
      } else {
        console.log('Success', JSON.stringify(data))
        resolve(data)
      }
    })
  })
}
