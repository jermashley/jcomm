#!/usr/bin/env node

const packageJson = require(`../package.json`)

const { Command } = require(`commander`)
const program = new Command()

const Configstore = require(`configstore`)
const config = new Configstore(packageJson.name)

const { authenticate } = require(`../lib/authenticate`)
const { deployTicket, destroyTicket, destroyAllTickets } = require(`../lib/pipeline`)

program.version(packageJson.version)

if (!config.has(`tickets`)) {
  config.set(`tickets`, [])
}

program
  .command(`init`)
  .description(`Login to get Pipeline and Jira tokens.`)
  .action(() => authenticate(config))

program
  .command(`logout`)
  .description(`Clear stored tokens.`)
  .action(() => {
    config.clear()
    console.log(`Successfully logged out.`)
  })

program
  .command(`spill`)
  .description(`Show config storage.`)
  .action(() => console.log(config.all))

program
  .command(`deploy [key]`)
  .description(`Deploy site to developer environment.`)
  .action((key) => deployTicket(key, config))

program
  .command(`destroy [key]`)
  .description(`Destroy site deployed to developer environment.`)
  .option(`-a, --all`, `Destroy all deployed sites in list.`)
  .action((key, options) => {
    if (options.all) {
      destroyAllTickets(config)
    }

    destroyTicket(key, config)
  })

program
  .command(`list`)
  .description(`List deployed tickets.`)
  .action(() => config.get(`tickets`).length ? console.table(config.get(`tickets`)) : console.log(`No tickets deployed`))

program.parse(process.argv)