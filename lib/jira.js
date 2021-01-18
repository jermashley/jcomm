const axios = require(`axios`)

const baseUrl = `https://prologuetech.atlassian.net/rest/api/3`

module.exports = {
  buildAuthorizationKey: function(username, token) {
    const builtToken = `Basic ${Buffer.from(`${username}:${token}`).toString(`base64`)}`

    return builtToken
  },

  getTicket: async function(key, username, token) {

    const ticket = await axios
      .get(`${baseUrl}/issue/${key}`, {
        headers: {
          Authorization: module.exports.buildAuthorizationKey(username, token),
          Accept: `application/json`
        }
      })
      .then(({data}) => data)
      .catch(e => console.log(e))

    return ticket
  }
}