"use strict";
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
exports.queueManager = exports.QueueManager = void 0;
const queueService_1 = require("./queueService");
class QueueManager {
    constructor(QueueClass = queueService_1.Queue) {
        this.queues = new Map();
        this.QueueClass = QueueClass;
    }
    getQueue(name) {
        if (!this.queues.has(name)) {
            this.queues.set(name, new this.QueueClass());
        }
        return this.queues.get(name);
    }
    /**
     * Enqueue a message. Returns true if the queue was newly created, false if it already existed.
     */
    enqueue(queueName, msg) {
        const isNew = !this.queues.has(queueName);
        this.getQueue(queueName).enqueue(msg);
        return isNew;
    }
    dequeue(queueName, timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getQueue(queueName).dequeue(timeout);
        });
    }
}
exports.QueueManager = QueueManager;
// Default export: singleton using in-memory Queue
exports.queueManager = new QueueManager();
