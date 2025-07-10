import { Queue } from '../services/queueService';
import { QueueManager, IQueue } from '../services/queueManager';

describe('QueueManager', () => {
  let queueManager: QueueManager;

  beforeEach(() => {
    queueManager = new QueueManager(Queue);
  });

  it('should enqueue and dequeue a message', async () => {
    queueManager.enqueue('test', { foo: 'bar' });
    const msg = await queueManager.dequeue('test', 100);
    expect(msg).toEqual({ foo: 'bar' });
  });

  it('should return null if no message after timeout', async () => {
    const msg = await queueManager.dequeue('empty', 100);
    expect(msg).toBeNull();
  });

  it('should support multiple queues independently', async () => {
    queueManager.enqueue('q1', { a: 1 });
    queueManager.enqueue('q2', { b: 2 });
    const msg1 = await queueManager.dequeue('q1', 100);
    const msg2 = await queueManager.dequeue('q2', 100);
    expect(msg1).toEqual({ a: 1 });
    expect(msg2).toEqual({ b: 2 });
  });

  it('should wait for a message if queue is empty, then resolve', async () => {
    setTimeout(() => queueManager.enqueue('wait', { hello: 'world' }), 50);
    const msg = await queueManager.dequeue('wait', 200);
    expect(msg).toEqual({ hello: 'world' });
  });
});
