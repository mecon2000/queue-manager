"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_TIMEOUT_MS = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Default timeout for queue polling (in milliseconds)
exports.DEFAULT_TIMEOUT_MS = process.env.DEFAULT_TIMEOUT_MS
    ? parseInt(process.env.DEFAULT_TIMEOUT_MS, 10)
    : 10000;
