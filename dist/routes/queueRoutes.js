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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const queueManager_1 = require("../services/queueManager");
const config_1 = require("../config");
const logger_1 = require("../utils/logger");
const router = express_1.default.Router();
// TODO: Add authentication (e.g., JWT or API keys)
// TODO: Add rate limiting
// TODO: Add input validation/sanitization
// POST /api/:queue_name
router.post('/:queue_name', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { queue_name } = req.params;
    const message = req.body;
    logger_1.logger.info(`POST /api/${queue_name} - message: ${JSON.stringify(message)}`);
    try {
        // TODO: Validate message body
        const isNew = queueManager_1.queueManager.enqueue(queue_name, message);
        return res.status(isNew ? 201 : 200).json({ status: 'enqueued' });
    }
    catch (err) {
        logger_1.logger.error(`Error enqueuing message to ${queue_name}: ${err}`);
        return res.status(500).json({ error: 'Internal server error' });
    }
}));
// GET /api/:queue_name?timeout=ms
router.get('/:queue_name', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { queue_name } = req.params;
    const timeout = req.query.timeout ? parseInt(req.query.timeout, 10) : config_1.DEFAULT_TIMEOUT_MS;
    logger_1.logger.info(`GET /api/${queue_name}?timeout=${timeout}`);
    try {
        const message = yield queueManager_1.queueManager.dequeue(queue_name, timeout);
        if (message === null) {
            return res.status(204).send();
        }
        return res.status(200).json(message);
    }
    catch (err) {
        logger_1.logger.error(`Error dequeuing message from ${queue_name}: ${err}`);
        return res.status(500).json({ error: 'Internal server error' });
    }
}));
exports.default = router;
