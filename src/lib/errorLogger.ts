import fs from 'fs';
import path from 'path';

const logFilePath = path.resolve(process.cwd(), 'error-log.txt');

export function logError(error: any) {
  const timestamp = new Date().toISOString();
  const errorMessage = typeof error === 'string' ? error : JSON.stringify(error, Object.getOwnPropertyNames(error));
  const logEntry = `[${timestamp}] ${errorMessage}\\n\\n`;
  fs.appendFileSync(logFilePath, logEntry);
}

export function clearErrorLog() {
  if (fs.existsSync(logFilePath)) {
    fs.unlinkSync(logFilePath);
  }
}
