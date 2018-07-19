var express = require('express')
var router = express.Router()

let awsHandler = require('./awsHandler.js')

/* GET home page. */
router.get('/describe', (req, res, next) => {
  awsHandler.describe().then(data => {
    res.json({ data })
  }).catch(err => {
    next(err)
  })
})

router.get('/start', (res, req, next) => {
  awsHandler.start().then(data => {
    res.json(data)
  }).catch(err => {
    next(err)
  })
})

router.post('/start', (res, req, next) => {
  awsHandler.start(req.body.duration).then(data => {
    res.json(data)
  }).catch(err => {
    next(err)
  })
})

router.get('/stop', (res, req, next) => {
  awsHandler.stop().then(data => {
    res.json(data)
  }).catch(err => {
    next(err)
  })
})

module.exports = router
