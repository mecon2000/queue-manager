"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const queueRoutes_1 = __importDefault(require("./routes/queueRoutes"));
const app = (0, express_1.default)();
// TODO: Add security middlewares (auth, rate limiting, input validation)
app.use(express_1.default.json());
app.use('/api', queueRoutes_1.default);
exports.default = app;
