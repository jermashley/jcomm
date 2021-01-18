# Jira Command

#### A command-line application to manage Dev and QA deployments

---

### Requirements

- Node 15 or above (will enforce later)

---

## Gettings Started

### Clone the repository

Start by cloning this repository to your local environment.

```bash
git clone git@bitbucket.org:prologuetech/jcomm.git 
```

### Install dependencies

Conde you have the repository cloned, `cd` into the directory and install the node dependencies.

```bash
cd jcomm/

npm install
```

### Link Command

In order to have global access to the `jcomm` command, you will need to link it to your global `PATH`.

```bash
npm link
```

### Authentication

Once you have linked the command, you will need to authenticate with the Pipeline service and Jira.

##### Input
```bash
jcomm init
```

##### Output
```bash
╓─────────────────────────────────────────────────────────────────╖
║                                                                 ║
║   Get your Jira API key at:                                     ║
║   https://id.atlassian.com/manage-profile/security/api-tokens   ║
║                                                                 ║
╙─────────────────────────────────────────────────────────────────╜
? Enter your Pipeline email address: email@prologuetechnology.com
? Enter your Pipeline password: [hidden]
? Jira API token: [hidden]

Successfully logged in!
```

> If you have multiple users in Pipeline, please use the account tied to either **Flat World Global Solutions** or **A Dev Demo Company**.

### Use

### `deploy [key]`
Deploy a specific ticket.

```bash
jcomm deploy SAM-500
```

### `destroy [key]`
Destroy a specific deployment.

```bash
jcomm destroy SAM-500
```

### `destroy --all`
Deploy all deployments made from your machine.

```bash
jcomm destroy --all
```

### `list`
List all deployments made from your machine.

```bash
jcomm list

┌─────────┬───────────┬───────────────────────┐
│ (index) │    key    │         date          │
├─────────┼───────────┼───────────────────────┤
│    0    │ 'SAM-650' │ '1/18/2021 @ 3:49:9'  │
│    1    │ 'SAM-714' │ '1/18/2021 @ 3:49:16' │
│    2    │ 'SAM-98'  │ '1/18/2021 @ 3:49:22' │
└─────────┴───────────┴───────────────────────┘
```