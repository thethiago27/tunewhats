const log = {
  whatsapp: (args) => console.log("\x1b[32m", `[whatsapp] ${args}`),
  system: (args) => console.log("\x1b[34m", `[system] ${args}`),
  error: (args) => console.log("\x1b[31m", `[error] ${args}`)
}

module.exports = log;