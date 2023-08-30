import winston from "winston";

const customLevelOptions = {
    levels: {
      fatal: 0,
      error: 1,
      warning: 2,
      info: 3,
      http: 4,
      debug: 5
    },
    colors: {
      fatal: 'red',
      error: 'orange',
      warning: 'yellow',
      info: 'blue',
      http: 'blue',
      debug: 'white'
    }
  }
  
const devLogger = winston.createLogger({levels: customLevelOptions.levels,
    transports: [new winston.transports.Console({level: "debug"})]
})

const prodLogger = winston.createLogger({levels: customLevelOptions.levels,
    transports: [new winston.transports.Console({level: "info",
    /*format: winston.format.combine(
        winston.format.colorize({colors: customLevelOptions.colors}),
        winston.format.simple()
    )*/}),
    new winston.transports.File({filename: "./errors.log", level: "error"})]
})

export const addLogger = (req, res, next) => {
    req.logger = process.env.ENVIRONMENT == 'PRODUCTION' ? prodLogger : devLogger;
    //req.logger.error(`Error en el método ${req.method} en ${req.url}`);
    next()
}
  