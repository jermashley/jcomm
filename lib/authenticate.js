const axios = require(`axios`)
const xml2js = require(`xml2js`)
const inquirer = require(`inquirer`)
const boxen = require(`boxen`)

module.exports = {
  authRequestConfig: {
    headers: {
      'Content-Type': `text/xml`
    }
  },

  generateAuthXmlString: function(username, password) {
    const string = `<?xml version="1.0" encoding="UTF-8"?>
    <Document>
       <Header>
          <LoginRequest>
             <APIKey />
             <PassKey />
          </LoginRequest>
          <RequestType>ApiCredentialsRequest</RequestType>
          <ApiCredentialsRequest>
          <Username>${username}</Username>
          <Password>${password}</Password>
          </ApiCredentialsRequest>
          <TestMode>off</TestMode>
       </Header>
    </Document>`

    return string
  },

  authenticationRequest: function(username, password) {
    const request = axios
      .post(`https://admin.fwgs.dev/webservices/quote.php`, module.exports.generateAuthXmlString(username, password), module.exports.authRequestConfig)
      .then(res => {
        let apiKey

        xml2js.parseString(res.data, (err, results) => {
          const key = results.Document.Body[0].Response[0].ApiCredentials[0].ApiKey[0]

          apiKey = key
        })

        return apiKey
      })
      .catch(e => console.log(e))

    return request
  },

  validateLength: function(value) {
    if (value.length) {
      return true
    } else {
      return `Please enter a value`
    }
  },

  authenticate: function(config) {
    console.log(boxen(`Get your Jira API key at:
https://id.atlassian.com/manage-profile/security/api-tokens`, {padding: 1, borderStyle: `singleDouble`}))

    inquirer
      .prompt([
        {
          type: `username`,
          message: `Enter your Pipeline email address:`,
          name: `username`,
          validate: module.exports.validateLength
        },
        {
          type: `password`,
          message: `Enter your Pipeline password:`,
          name: `password`,
          validate: module.exports.validateLength
        },
        {
          type: `password`,
          message: `Jira API token:`,
          name: `jiraToken`,
          validate: module.exports.validateLength
        }
      ])
      .then(({ username, password, jiraToken }) => {
        module.exports.authenticationRequest(username, password)
          .then(res => {
            config.set(`apiKey`, res)

            console.log(`Successfully logged in!`)
          })

        config.set({
          username,
          jiraToken
        })
      })
  }
}