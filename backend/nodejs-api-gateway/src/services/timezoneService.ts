import axios from 'axios';
import { logger } from '../utils/logger';

const GO_SERVICE_URL = process.env.GO_TIMEZONE_SERVICE_URL || 'http://localhost:8081';

export class TimezoneService {
  async convertTime(time: string, fromTimezone: string, toTimezone: string) {
    try {
      const response = await axios.post(`${GO_SERVICE_URL}/convert`, {
        time,
        fromTimezone,
        toTimezone,
      });

      return response.data;
    } catch (error) {
      logger.error('Timezone conversion failed:', error);
      throw new Error('Timezone conversion failed');
    }
  }

  async batchConvert(time: string, fromTimezone: string, toTimezones: string[]) {
    try {
      const response = await axios.post(`${GO_SERVICE_URL}/batch-convert`, {
        time,
        fromTimezone,
        toTimezones,
      });

      return response.data;
    } catch (error) {
      logger.error('Batch timezone conversion failed:', error);
      throw new Error('Batch timezone conversion failed');
    }
  }

  // fallback if Go service is down - basic conversion using JS
  convertTimeLocal(time: string, fromTimezone: string, toTimezone: string) {
    try {
      const date = new Date(time);

      // this is a simplified version - the Go service does it better
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: toTimezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });

      return {
        originalTime: time,
        convertedTime: formatter.format(date),
        fromTimezone,
        toTimezone,
      };
    } catch (error) {
      logger.error('Local timezone conversion failed:', error);
      throw new Error('Timezone conversion failed');
    }
  }
}
