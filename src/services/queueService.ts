// In-memory queue implementation. Replace with DB/external queue for persistence in production.
// TODO: Add input validation/sanitization where needed.

import { logger } from '../utils/logger';

interface Waiter {
  resolve: (msg: any) => void;
  timer: NodeJS.Timeout;
}

export class Queue {
  private messages: any[] = [];
  private waiters: Waiter[] = [];

  enqueue(msg: any) {
    try {
      // TODO: Input validation/sanitization
      if (this.waiters.length > 0) {
        const waiter = this.waiters.shift();
        if (waiter) {
          clearTimeout(waiter.timer);
          waiter.resolve(msg);
        }
      } else {
        this.messages.push(msg);
      }
    } catch (err) {
      logger.error(`Queue.enqueue error: ${err}`);
      throw err;
    }
  }

  async dequeue(timeout: number): Promise<any | null> {
    try {
      if (this.messages.length > 0) {
        return this.messages.shift();
      }
      // Wait for a message or timeout
      return new Promise((resolve) => {
        const timer = setTimeout(() => {
          // Remove this waiter if not already resolved
          this.waiters = this.waiters.filter((w) => w.resolve !== resolve);
          resolve(null);
        }, timeout);
        this.waiters.push({ resolve, timer });
      });
    } catch (err) {
      logger.error(`Queue.dequeue error: ${err}`);
      throw err;
    }
  }
}
