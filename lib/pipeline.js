const axios = require(`axios`)
const { format } = require(`date-fns`)
const { getTicket } = require(`./jira`)

const baseUrl = `https://admin.fwgs.dev/app.php`

module.exports = {
  deployTicket: async function(key, config) {
    const keyData = await getTicket(key, config.get(`username`), config.get(`jiraToken`))
    const timestamp = format(new Date(), `M/d/yyyy @ h:m:s`)

    axios
      .post(`${baseUrl}?r=api/v1/deployQASite`, keyData, {
        headers: {
          apiKey: config.get(`apiKey`)
        }
      })
      .then(res => {
        config.set(`tickets`, [
          ...config.get(`tickets`),
          {
            key: keyData.key,
            date: timestamp
          }
        ])

        console.log(`${key}: ${res.data.message}`)
      })
      .catch(e => console.log(e))
  },

  destroyTicket: async function(key, config) {
    if (key) {
      const keyData = await getTicket(key, config.get(`username`), config.get(`jiraToken`))

      axios
      .post(`${baseUrl}?r=api/v1/destroyQASite`, keyData, {
        headers: {
          apiKey: config.get(`apiKey`)
        }
      })
      .then(res => {
        let tickets = config.get(`tickets`)
        tickets = tickets.filter(ticket => ticket.key !== key)

        config.set(`tickets`, [
          ...tickets
        ])

        console.log(`${key}: ${res.data.message}`)
      })
      .catch(e => console.log(e))
    }

    return `No ticket deployed to destroy.`
  },

  destroyAllTickets: function(config) {
    const tickets = config.get(`tickets`)

    tickets.forEach(ticket => {
      setTimeout(() => {
        module.exports.destroyTicket(ticket.key, config)
      }, 2000)
    })
  }
}