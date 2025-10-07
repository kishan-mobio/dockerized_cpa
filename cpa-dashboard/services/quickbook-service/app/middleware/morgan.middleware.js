import morgan from "morgan";
import { createLogger } from "../utils/logger.utils.js";
import { API_ENDPOINTS } from "../constants/app.constants.js";
import { MORGAN_FORMATS } from "../constants/strings.constants.js";

const logger = createLogger("MORGAN_MIDDLEWARE");

morgan.token("id", (req) => req.id);

morgan.token("response-time", (req, res) => {
  if (!res._header || !req._startAt) return "";
  const diff = process.hrtime(req._startAt);
  const ms = Math.round(diff[0] * 1e3 + diff[1] * 1e-6);
  return `${ms}ms`;
});

morgan.token("content-length", (req, res) => {
  return res.get("content-length") ? res.get("content-length") : "";
});

morgan.token("user-agent", (req) => {
  return req.get("user-agent") ? req.get("user-agent") : "";
});

morgan.token("remote-addr", (req) => {
  return req.ip
    ? req.ip
    : req.connection.remoteAddress
    ? req.connection.remoteAddress
    : req.socket.remoteAddress
    ? req.socket.remoteAddress
    : req.connection.socket?.remoteAddress
    ? req.connection.socket.remoteAddress
    : "";
});

morgan.token("method", (req) => {
  return req.method;
});

morgan.token("url", (req) => {
  return req.originalUrl ? req.originalUrl : req.url;
});

morgan.token("status", (req, res) => {
  return res.statusCode;
});

morgan.token("date", () => {
  return new Date().toISOString();
});

const devFormat = ":method :url :status :response-time ms - :remote-addr";
const prodFormat =
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';
const detailedFormat =
  ":method :url :status :response-time ms - :remote-addr - :user-agent";

export const morganMiddleware = (format = "combined") => {
  let morganFormat;

  switch (format) {
    case MORGAN_FORMATS.DEV:
      morganFormat = devFormat;
      break;
    case MORGAN_FORMATS.PROD:
      morganFormat = prodFormat;
      break;
    case MORGAN_FORMATS.DETAILED:
      morganFormat = detailedFormat;
      break;
    case MORGAN_FORMATS.COMBINED:
      morganFormat = MORGAN_FORMATS.COMBINED;
      break;
    case MORGAN_FORMATS.COMMON:
      morganFormat = MORGAN_FORMATS.COMMON;
      break;
    case MORGAN_FORMATS.SHORT:
      morganFormat = MORGAN_FORMATS.SHORT;
      break;
    case MORGAN_FORMATS.TINY:
      morganFormat = MORGAN_FORMATS.TINY;
      break;
    default:
      morganFormat = MORGAN_FORMATS.COMBINED;
  }

  return morgan(morganFormat, {
    stream: {
      write: (message) => {
        logger.info(message.trim());
      },
    },
    skip: (req, _res) => {
      return req.url === API_ENDPOINTS.HEALTH;
    },
  });
};

export const morganFileStream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

export default morganMiddleware;
