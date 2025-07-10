"use strict";
// In-memory queue implementation. Replace with DB/external queue for persistence in production.
// TODO: Add input validation/sanitization where needed.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = void 0;
const logger_1 = require("../utils/logger");
class Queue {
    constructor() {
        this.messages = [];
        this.waiters = [];
    }
    enqueue(msg) {
        try {
            // TODO: Input validation/sanitization
            if (this.waiters.length > 0) {
                const waiter = this.waiters.shift();
                if (waiter) {
                    clearTimeout(waiter.timer);
                    waiter.resolve(msg);
                }
            }
            else {
                this.messages.push(msg);
            }
        }
        catch (err) {
            logger_1.logger.error(`Queue.enqueue error: ${err}`);
            throw err;
        }
    }
    dequeue(timeout) {
        return __awaiter(this, void 0, void 0, function* () {
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
            }
            catch (err) {
                logger_1.logger.error(`Queue.dequeue error: ${err}`);
                throw err;
            }
        });
    }
}
exports.Queue = Queue;
