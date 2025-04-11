import chalk from 'chalk'

export function printError(message) {
  console.error(chalk.red(message))
}

export function printSuccess(message) {
  console.log(chalk.green(message))
}

export function printInfo(message) {
  console.log(chalk.blue(message))
}

export function printWarning(message) {
  console.warn(chalk.yellow(message))
}
