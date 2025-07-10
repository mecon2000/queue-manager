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
const queueService_1 = require("../services/queueService");
const queueManager_1 = require("../services/queueManager");
describe('QueueManager', () => {
    let queueManager;
    beforeEach(() => {
        queueManager = new queueManager_1.QueueManager(queueService_1.Queue);
    });
    it('should enqueue and dequeue a message', () => __awaiter(void 0, void 0, void 0, function* () {
        queueManager.enqueue('test', { foo: 'bar' });
        const msg = yield queueManager.dequeue('test', 100);
        expect(msg).toEqual({ foo: 'bar' });
    }));
    it('should return null if no message after timeout', () => __awaiter(void 0, void 0, void 0, function* () {
        const msg = yield queueManager.dequeue('empty', 100);
        expect(msg).toBeNull();
    }));
    it('should support multiple queues independently', () => __awaiter(void 0, void 0, void 0, function* () {
        queueManager.enqueue('q1', { a: 1 });
        queueManager.enqueue('q2', { b: 2 });
        const msg1 = yield queueManager.dequeue('q1', 100);
        const msg2 = yield queueManager.dequeue('q2', 100);
        expect(msg1).toEqual({ a: 1 });
        expect(msg2).toEqual({ b: 2 });
    }));
    it('should wait for a message if queue is empty, then resolve', () => __awaiter(void 0, void 0, void 0, function* () {
        setTimeout(() => queueManager.enqueue('wait', { hello: 'world' }), 50);
        const msg = yield queueManager.dequeue('wait', 200);
        expect(msg).toEqual({ hello: 'world' });
    }));
});
