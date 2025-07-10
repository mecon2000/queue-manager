import { Queue } from './queueService';

// Interface for a queue, to allow easy replacement with an external library
export interface IQueue {
  enqueue(msg: any): void;
  dequeue(timeout: number): Promise<any | null>;
}

export class QueueManager {
  private queues: Map<string, IQueue> = new Map();
  private QueueClass: new () => IQueue;

  constructor(QueueClass: new () => IQueue = Queue) {
    this.QueueClass = QueueClass;
  }

  getQueue(name: string): IQueue {
    if (!this.queues.has(name)) {
      this.queues.set(name, new this.QueueClass());
    }
    return this.queues.get(name)!;
  }

  /**
   * Enqueue a message. Returns true if the queue was newly created, false if it already existed.
   */
  enqueue(queueName: string, msg: any): boolean {
    const isNew = !this.queues.has(queueName);
    this.getQueue(queueName).enqueue(msg);
    return isNew;
  }

  async dequeue(queueName: string, timeout: number): Promise<any | null> {
    return this.getQueue(queueName).dequeue(timeout);
  }
}

// Default export: singleton using in-memory Queue
export const queueManager = new QueueManager(); 