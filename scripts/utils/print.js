import chalk from 'chalk'

export function printError(msg) {
  console.error(chalk.red(msg))
}

export function printSuccess(msg) {
  console.log(chalk.green(msg))
}

export function printInfo(msg) {
  console.log(chalk.blue(msg))
}

export function printWarning(msg) {
  console.warn(chalk.yellow(msg))
}
