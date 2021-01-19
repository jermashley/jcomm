const axios = require(`axios`)
const xml2js = require(`xml2js`)
const inquirer = require(`inquirer`)
const boxen = require(`boxen`)
const chalk = require(`chalk`)

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
    const xml = module.exports.generateAuthXmlString(username, password)
    const config = module.exports.authRequestConfig

    const request = axios
      .post(
        `https://admin.fwgs.dev/webservices/quote.php`,
        xml,
        config
      )
      .then(res => {
        let apiKey

        xml2js.parseString(res.data, (err, results) => {
          if (results.Document.Response) {
            if (results.Document.Response[0].ErrorResponse[0].Error[0]) {
              const error = results.Document.Response[0].ErrorResponse[0].Error[0]
              console.error(chalk.bgRed.bold(`\nPipeline ${error}. Please try again.`))
              process.exit(1)
            }
          }

          const key = results.Document.Body[0].Response[0].ApiCredentials[0].ApiKey[0]
          apiKey = key
        })

        return apiKey
      })

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
    console.log(boxen(`You'll need to get a Jira API key at:\n${chalk.bold.underline(`https://id.atlassian.com/manage-profile/security/api-tokens`)}`, {padding: 1, borderStyle: `classic`}) + `\n`)

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

            console.log(chalk.green.bold(`\nSuccessfully logged in!`))
          })

        config.set({
          username,
          jiraToken
        })
      })
  },
}