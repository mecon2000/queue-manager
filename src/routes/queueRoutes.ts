import express from 'express';
import { queueManager } from '../services/queueManager';
import { DEFAULT_TIMEOUT_MS } from '../config';
import { logger } from '../utils/logger';

const router = express.Router();

// TODO: Add authentication (e.g., JWT or API keys)
// TODO: Add rate limiting
// TODO: Add input validation/sanitization

// POST /api/:queue_name
router.post('/:queue_name', async (req, res) => {
  const { queue_name } = req.params;
  const message = req.body;
  logger.info(`POST /api/${queue_name} - message: ${JSON.stringify(message)}`);
  try {
    // TODO: Validate message body
    const isNew = queueManager.enqueue(queue_name, message);
    return res.status(isNew ? 201 : 200).json({ status: 'enqueued' });
  } catch (err) {
    logger.error(`Error enqueuing message to ${queue_name}: ${err}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/:queue_name?timeout=ms
router.get('/:queue_name', async (req, res) => {
  const { queue_name } = req.params;
  const timeout = req.query.timeout ? parseInt(req.query.timeout as string, 10) : DEFAULT_TIMEOUT_MS;
  logger.info(`GET /api/${queue_name}?timeout=${timeout}`);
  try {
    const message = await queueManager.dequeue(queue_name, timeout);
    if (message === null) {
      return res.status(204).send();
    }
    return res.status(200).json(message);
  } catch (err) {
    logger.error(`Error dequeuing message from ${queue_name}: ${err}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
