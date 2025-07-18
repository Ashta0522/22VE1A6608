import axios from "axios";
import { Request, Response, NextFunction } from "express";
import { getAuthToken } from "../utils/auth";

const LOG_API = "http://20.244.56.144/evaluation-service/logs";

export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";
export type LogStack = "backend";
export type LogPackage = "controller" | "service" | "route" | "middleware" | "utils";

export interface LogPayload {
  stack: LogStack;
  level: LogLevel;
  package: LogPackage;
  message: string;
}

export const logger = (pkg: LogPackage) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    res.locals.log = async (level: LogLevel, message: string) => {
      try {
        const token = await getAuthToken();
        await axios.post(
          LOG_API,
          {
            stack: "backend",
            level,
            package: pkg,
            message,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } catch (err) {
        // Do not throw, do not use console.log
      }
    };
    next();
  };
}; 