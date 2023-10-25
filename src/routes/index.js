module.exports = api => api
  .use('/auth', require('./authentication.router'))
  .use('/job', require('./job.router'))
  .use('/company', require('./company.router'))
  .use('/occupation', require('./occupation.router'))
  .use('/application', require('./application.router'))
  .use('/statistical', require('./statistical.route'))
  .use('/firebase', require('./firebase.route'))