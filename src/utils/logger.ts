const colors: Record<string, string> = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',

  fgWhite: '\x1b[37m',
  fgBlack: '\x1b[30m',

  bgRed: '\x1b[41m',
  bgYellow: '\x1b[43m',
}

export class Logger {
  private prefix: string

  constructor(prefix: string) {
    this.prefix = prefix.padEnd(15, ' ')
  }

  public debug(...message: unknown[]) {
    this.outputToConsole(message, 'dim')
  }

  public info(...message: unknown[]) {
    this.outputToConsole(message)
  }

  public warn(...message: unknown[]) {
    this.outputToConsole(message, 'bright', 'bgYellow')
  }

  public error(...message: unknown[]) {
    // todo handle error instances
    this.outputToConsole(message, 'bright', 'bgRed')
  }

  private outputToConsole(message: unknown[], messageColor: string = 'bright', bgColor?: string) {
    const datePrefix = `${colors.dim}${new Date().toISOString()}${colors.reset}`
    const messageCode = colors[messageColor]
    const bgCode = bgColor && colors[bgColor] || ''
    const messagePrefix = `${messageCode}${bgCode}| ${this.prefix} |${colors.reset}`
    console.log(`${datePrefix} ${messagePrefix}`, ...message)
  }
}

export const logger = new Logger('[API]')