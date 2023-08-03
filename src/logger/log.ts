import chalk from 'chalk';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'success';

export type LogLevelEntry = {
  color: typeof chalk.blue,
  func: (...args: any[]) => void;
};

const hostConsole = console;

const logTypes: Record<LogLevel, LogLevelEntry>  = {
  info: {
    color: chalk.cyan,
    func: console.info.bind(hostConsole),
  },
  warn: {
    color: chalk.yellow,
    func: console.warn.bind(hostConsole),
  },
  error: {
    color: chalk.red,
    func: console.error.bind(hostConsole),
  },
  debug: {
    color: chalk.gray,
    func: console.log.bind(hostConsole),
  },
  success: {
    color: chalk.green,
    func: console.log.bind(hostConsole),
  },
};

export const log = Object.keys(logTypes).reduce((acc, key) => {
  const entry: LogLevelEntry = logTypes[key as LogLevel];
  acc[key as LogLevel] = (...args: any[]) => {
    entry.func(entry.color(`[${key}]`), ...args);
  };
  return acc;
}, {} as Record<LogLevel, (...args: any[]) => void>);

