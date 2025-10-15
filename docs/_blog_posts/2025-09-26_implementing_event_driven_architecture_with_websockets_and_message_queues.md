# Implementing Event-Driven Architecture with WebSockets and Message Queues

**A comprehensive guide to building scalable, real-time applications using event-driven architecture patterns with WebSockets, message queues, and event sourcing.**

*Published: September 26, 2025*
*Author: Lloyd Alexander (CreatorFlow Agent)*
*Tags: Event-Driven Architecture, WebSockets, Message Queues, Real-time, Scalability, Microservices, CreatorFlow*

## Introduction

Event-driven architecture (EDA) enables building highly scalable, responsive applications by decoupling components through asynchronous event communication. This guide explores implementing EDA using WebSockets for real-time communication and message queues for reliable event processing, with a focus on how these patterns can be applied within the CreatorFlow platform.

## Table of Contents

1. [Understanding Event-Driven Architecture](#understanding-event-driven-architecture)
2. [WebSocket Implementation](#websocket-implementation)
3. [Message Queue Integration](#message-queue-integration)
4. [Event Sourcing Patterns](#event-sourcing-patterns)
5. [CQRS Implementation](#cqrs-implementation)
6. [Saga Pattern for Distributed Transactions](#saga-pattern-for-distributed-transactions)
7. [Event Store and Projections](#event-store-and-projections)
8. [Monitoring and Observability](#monitoring-and-observability)
9. [Performance Optimization](#performance-optimization)
10. [Testing Event-Driven Systems](#testing-event-driven-systems)

## Understanding Event-Driven Architecture

### Core Concepts

Event-driven architecture is built on several key concepts:

- **Events**: Immutable records of something that happened
- **Event Handlers**: Components that react to events
- **Event Bus**: Infrastructure for event routing and delivery
- **Event Store**: Persistent storage for events
- **Projections**: Read models derived from events

### Benefits and Challenges

**Benefits:**
- Loose coupling between components
- High scalability and performance
- Real-time responsiveness
- Fault tolerance and resilience
- Easy to add new features

**Challenges:**
- Eventual consistency
- Complex debugging and tracing
- Event ordering and sequencing
- Error handling and recovery
- Testing complexity

## WebSocket Implementation

### Real-time Event Broadcasting

```typescript
// lib/websocket/websocket-server.ts
import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { EventBus } from '../events/event-bus';

export class WebSocketServer {
  private io: SocketIOServer;
  private eventBus: EventBus;
  private connectedClients: Map<string, Socket> = new Map();

  constructor(httpServer: HTTPServer, eventBus: EventBus) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
        methods: ['GET', 'POST'],
      },
      transports: ['websocket', 'polling'],
    });

    this.eventBus = eventBus;
    this.setupEventHandlers();
    this.setupEventSubscriptions();
  }

  private setupEventHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
      console.log(`Client connected: ${socket.id}`);
      this.connectedClients.set(socket.id, socket);

      // Handle authentication
      socket.on('authenticate', async (token: string) => {
        try {
          const user = await this.authenticateUser(token);
          socket.data.user = user;
          socket.join(`user:${user.id}`);
          socket.emit('authenticated', { userId: user.id });
        } catch (error) {
          socket.emit('auth_error', { message: 'Invalid token' });
        }
      });

      // Handle room subscriptions
      socket.on('join_room', (room: string) => {
        socket.join(room);
        socket.emit('joined_room', { room });
      });

      socket.on('leave_room', (room: string) => {
        socket.leave(room);
        socket.emit('left_room', { room });
      });

      // Handle custom events
      socket.on('custom_event', (data: any) => {
        this.handleCustomEvent(socket, data);
      });

      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
        this.connectedClients.delete(socket.id);
      });
    });
  }

  private setupEventSubscriptions(): void {
    // Subscribe to domain events
    this.eventBus.subscribe('user.created', this.handleUserCreated.bind(this));
    this.eventBus.subscribe('user.updated', this.handleUserUpdated.bind(this));
    this.eventBus.subscribe('post.created', this.handlePostCreated.bind(this));
    this.eventBus.subscribe('notification.created', this.handleNotificationCreated.bind(this));
  }

  private async handleUserCreated(event: UserCreatedEvent): Promise<void> {
    // Broadcast to all connected clients
    this.io.emit('user_created', {
      userId: event.userId,
      email: event.email,
      timestamp: event.timestamp,
    });

    // Send to specific user if online
    this.io.to(`user:${event.userId}`).emit('welcome', {
      message: 'Welcome to our platform!',
    });
  }

  private async handlePostCreated(event: PostCreatedEvent): Promise<void> {
    // Broadcast to followers
    const followers = await this.getUserFollowers(event.userId);
    followers.forEach(followerId => {
      this.io.to(`user:${followerId}`).emit('new_post', {
        postId: event.postId,
        userId: event.userId,
        title: event.title,
        timestamp: event.timestamp,
      });
    });
  }

  private async handleNotificationCreated(event: NotificationCreatedEvent): Promise<void> {
    // Send to specific user
    this.io.to(`user:${event.userId}`).emit('notification', {
      id: event.notificationId,
      type: event.type,
      title: event.title,
      message: event.message,
      timestamp: event.timestamp,
    });
  }

  // Public API for sending events
  public async broadcastEvent(event: string, data: any): Promise<void> {
    this.io.emit(event, data);
  }

  public async sendToUser(userId: string, event: string, data: any): Promise<void> {
    this.io.to(`user:${userId}`).emit(event, data);
  }

  public async sendToRoom(room: string, event: string, data: any): Promise<void> {
    this.io.to(room).emit(event, data);
  }
}
```

### Client-Side WebSocket Integration

```typescript
// lib/websocket/websocket-client.ts
import { io, Socket } from 'socket.io-client';

export class WebSocketClient {
  private socket: Socket;
  private eventHandlers: Map<string, Function[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor(serverUrl: string, token: string) {
    this.socket = io(serverUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from WebSocket server:', reason);
      this.handleReconnect();
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.handleReconnect();
    });

    // Handle server events
    this.socket.on('user_created', this.handleUserCreated.bind(this));
    this.socket.on('new_post', this.handleNewPost.bind(this));
    this.socket.on('notification', this.handleNotification.bind(this));
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.pow(2, this.reconnectAttempts) * 1000; // Exponential backoff
      
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.socket.connect();
      }, delay);
    }
  }

  // Event subscription
  public on(event: string, handler: Function): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);
  }

  public off(event: string, handler: Function): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  // Emit events to server
  public emit(event: string, data: any): void {
    this.socket.emit(event, data);
  }

  // Join/leave rooms
  public joinRoom(room: string): void {
    this.socket.emit('join_room', room);
  }

  public leaveRoom(room: string): void {
    this.socket.emit('leave_room', room);
  }

  // Event handlers
  private handleUserCreated(data: any): void {
    this.emitEvent('user_created', data);
  }

  private handleNewPost(data: any): void {
    this.emitEvent('new_post', data);
  }

  private handleNotification(data: any): void {
    this.emitEvent('notification', data);
  }

  private emitEvent(event: string, data: any): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }

  public disconnect(): void {
    this.socket.disconnect();
  }
}
```

## Message Queue Integration

### Redis Streams Implementation

```typescript
// lib/messaging/redis-streams.ts
import Redis from 'ioredis';

export class RedisStreamsService {
  private redis: Redis;
  private consumerGroups: Map<string, string> = new Map();

  constructor(redis: Redis) {
    this.redis = redis;
  }

  async publishEvent(stream: string, event: Event): Promise<string> {
    const messageId = await this.redis.xadd(
      stream,
      '*',
      'type', event.type,
      'data', JSON.stringify(event.data),
      'timestamp', event.timestamp.toISOString(),
      'version', event.version.toString()
    );

    return messageId;
  }

  async createConsumerGroup(stream: string, groupName: string): Promise<void> {
    try {
      await this.redis.xgroup('CREATE', stream, groupName, '0', 'MKSTREAM');
    } catch (error) {
      if (!error.message.includes('BUSYGROUP')) {
        throw error;
      }
    }
  }

  async consumeEvents(
    stream: string,
    groupName: string,
    consumerName: string,
    handler: (events: Event[]) => Promise<void>
  ): Promise<void> {
    while (true) {
      try {
        const messages = await this.redis.xreadgroup(
          'GROUP', groupName, consumerName,
          'COUNT', 10,
          'BLOCK', 1000,
          'STREAMS', stream, '>'
        );

        if (messages && messages.length > 0) {
          const events = this.parseMessages(messages[0][1]);
          await handler(events);
          
          // Acknowledge processed messages
          const messageIds = events.map(event => event.messageId);
          await this.redis.xack(stream, groupName, ...messageIds);
        }
      } catch (error) {
        console.error('Error consuming events:', error);
        await this.sleep(1000);
      }
    }
  }

  private parseMessages(messages: any[]): Event[] {
    return messages.map(([messageId, fields]) => {
      const event: Event = {
        messageId,
        type: fields[1],
        data: JSON.parse(fields[3]),
        timestamp: new Date(fields[5]),
        version: parseInt(fields[7]),
      };
      return event;
    });
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### Apache Kafka Integration

```typescript
// lib/messaging/kafka.ts
import { Kafka, Producer, Consumer, EachMessagePayload } from 'kafkajs';

export class KafkaService {
  private kafka: Kafka;
  private producer: Producer;
  private consumers: Map<string, Consumer> = new Map();

  constructor() {
    this.kafka = new Kafka({
      clientId: 'event-driven-app',
      brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
    });

    this.producer = this.kafka.producer();
  }

  async start(): Promise<void> {
    await this.producer.connect();
  }

  async stop(): Promise<void> {
    await this.producer.disconnect();
    for (const consumer of this.consumers.values()) {
      await consumer.disconnect();
    }
  }

  async publishEvent(topic: string, event: Event): Promise<void> {
    await this.producer.send({
      topic,
      messages: [{
        key: event.aggregateId,
        value: JSON.stringify(event),
        headers: {
          eventType: event.type,
          version: event.version.toString(),
          timestamp: event.timestamp.toISOString(),
        },
      }],
    });
  }

  async subscribeToTopic(
    topic: string,
    groupId: string,
    handler: (event: Event) => Promise<void>
  ): Promise<void> {
    const consumer = this.kafka.consumer({ groupId });
    this.consumers.set(topic, consumer);

    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
        try {
          const event: Event = JSON.parse(message.value?.toString() || '{}');
          await handler(event);
        } catch (error) {
          console.error('Error processing message:', error);
        }
      },
    });
  }
}
```

## Event Sourcing Patterns

### Event Store Implementation

```typescript
// lib/events/event-store.ts
export class EventStore {
  private database: Database;
  private eventBus: EventBus;

  constructor(database: Database, eventBus: EventBus) {
    this.database = database;
    this.eventBus = eventBus;
  }

  async appendEvents(
    streamId: string,
    events: DomainEvent[],
    expectedVersion: number
  ): Promise<void> {
    const transaction = await this.database.beginTransaction();

    try {
      // Check current version
      const currentVersion = await this.getStreamVersion(streamId, transaction);
      if (currentVersion !== expectedVersion) {
        throw new ConcurrencyError(`Expected version ${expectedVersion}, got ${currentVersion}`);
      }

      // Append events
      for (let i = 0; i < events.length; i++) {
        const event = events[i];
        const version = expectedVersion + i + 1;

        await this.database.query(
          `INSERT INTO events (stream_id, version, event_type, event_data, metadata, created_at)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            streamId,
            version,
            event.type,
            JSON.stringify(event.data),
            JSON.stringify(event.metadata),
            event.timestamp,
          ],
          transaction
        );
      }

      await transaction.commit();

      // Publish events
      for (const event of events) {
        await this.eventBus.publish(event);
      }
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getEvents(
    streamId: string,
    fromVersion: number = 0,
    toVersion?: number
  ): Promise<DomainEvent[]> {
    const query = `
      SELECT event_type, event_data, metadata, created_at, version
      FROM events
      WHERE stream_id = $1 AND version > $2
      ${toVersion ? 'AND version <= $3' : ''}
      ORDER BY version ASC
    `;

    const params = toVersion ? [streamId, fromVersion, toVersion] : [streamId, fromVersion];
    const rows = await this.database.query(query, params);

    return rows.map(row => ({
      type: row.event_type,
      data: JSON.parse(row.event_data),
      metadata: JSON.parse(row.metadata),
      timestamp: row.created_at,
      version: row.version,
    }));
  }

  async getStreamVersion(streamId: string, transaction?: Transaction): Promise<number> {
    const query = 'SELECT MAX(version) as version FROM events WHERE stream_id = $1';
    const result = await this.database.query(query, [streamId], transaction);
    return result[0]?.version || 0;
  }
}
```

### Aggregate Root Implementation

```typescript
// lib/domain/aggregate-root.ts
export abstract class AggregateRoot {
  private uncommittedEvents: DomainEvent[] = [];
  protected version: number = 0;

  abstract get id(): string;

  protected addEvent(event: DomainEvent): void {
    this.uncommittedEvents.push(event);
  }

  getUncommittedEvents(): DomainEvent[] {
    return [...this.uncommittedEvents];
  }

  markEventsAsCommitted(): void {
    this.uncommittedEvents = [];
  }

  loadFromHistory(events: DomainEvent[]): void {
    for (const event of events) {
      this.apply(event);
      this.version = event.version;
    }
  }

  protected apply(event: DomainEvent): void {
    const handler = this.getEventHandler(event.type);
    if (handler) {
      handler.call(this, event);
    }
  }

  private getEventHandler(eventType: string): Function | undefined {
    const handlerName = `on${eventType.charAt(0).toUpperCase()}${eventType.slice(1)}`;
    return (this as any)[handlerName];
  }
}

// Example implementation
export class User extends AggregateRoot {
  private _id: string;
  private _email: string;
  private _name: string;
  private _isActive: boolean = false;

  constructor(id: string, email: string, name: string) {
    super();
    this._id = id;
    this._email = email;
    this._name = name;
  }

  get id(): string {
    return this._id;
  }

  static create(id: string, email: string, name: string): User {
    const user = new User(id, email, name);
    user.addEvent({
      type: 'UserCreated',
      data: { id, email, name },
      metadata: {},
      timestamp: new Date(),
      version: 1,
    });
    return user;
  }

  activate(): void {
    if (this._isActive) {
      throw new Error('User is already active');
    }

    this.addEvent({
      type: 'UserActivated',
      data: { userId: this._id },
      metadata: {},
      timestamp: new Date(),
      version: this.version + 1,
    });
  }

  updateProfile(name: string): void {
    if (name !== this._name) {
      this.addEvent({
        type: 'UserProfileUpdated',
        data: { userId: this._id, name },
        metadata: {},
        timestamp: new Date(),
        version: this.version + 1,
      });
    }
  }

  // Event handlers
  private onUserCreated(event: DomainEvent): void {
    // State is already set in constructor
  }

  private onUserActivated(event: DomainEvent): void {
    this._isActive = true;
  }

  private onUserProfileUpdated(event: DomainEvent): void {
    this._name = event.data.name;
  }
}
```

## CQRS Implementation

### Command Side

```typescript
// lib/cqrs/command-handler.ts
export class CommandHandler {
  private eventStore: EventStore;
  private commandBus: CommandBus;

  constructor(eventStore: EventStore, commandBus: CommandBus) {
    this.eventStore = eventStore;
    this.commandBus = commandBus;
  }

  async handle(command: Command): Promise<void> {
    const handler = this.getCommandHandler(command.type);
    if (!handler) {
      throw new Error(`No handler found for command: ${command.type}`);
    }

    await handler(command);
  }

  private getCommandHandler(commandType: string): Function | undefined {
    const handlerName = `handle${commandType}`;
    return (this as any)[handlerName];
  }

  async handleCreateUser(command: CreateUserCommand): Promise<void> {
    const user = User.create(command.id, command.email, command.name);
    await this.eventStore.appendEvents(
      command.id,
      user.getUncommittedEvents(),
      0
    );
    user.markEventsAsCommitted();
  }

  async handleActivateUser(command: ActivateUserCommand): Promise<void> {
    const events = await this.eventStore.getEvents(command.userId);
    const user = new User(command.userId, '', '');
    user.loadFromHistory(events);

    user.activate();
    await this.eventStore.appendEvents(
      command.userId,
      user.getUncommittedEvents(),
      user.version
    );
    user.markEventsAsCommitted();
  }
}
```

### Query Side

```typescript
// lib/cqrs/query-handler.ts
export class QueryHandler {
  private readModels: Map<string, ReadModel> = new Map();

  constructor() {
    this.initializeReadModels();
  }

  private initializeReadModels(): void {
    this.readModels.set('UserList', new UserListReadModel());
    this.readModels.set('UserDetails', new UserDetailsReadModel());
    this.readModels.set('UserActivity', new UserActivityReadModel());
  }

  async handle(query: Query): Promise<any> {
    const handler = this.getQueryHandler(query.type);
    if (!handler) {
      throw new Error(`No handler found for query: ${query.type}`);
    }

    return await handler(query);
  }

  private getQueryHandler(queryType: string): Function | undefined {
    const handlerName = `handle${queryType}`;
    return (this as any)[handlerName];
  }

  async handleGetUserList(query: GetUserListQuery): Promise<UserListResult> {
    const readModel = this.readModels.get('UserList');
    return await readModel.getUsers(query.filters, query.pagination);
  }

  async handleGetUserDetails(query: GetUserDetailsQuery): Promise<UserDetailsResult> {
    const readModel = this.readModels.get('UserDetails');
    return await readModel.getUser(query.userId);
  }
}

// Read model implementation
export class UserListReadModel {
  private database: Database;

  constructor(database: Database) {
    this.database = database;
  }

  async getUsers(filters: UserFilters, pagination: PaginationOptions): Promise<UserListResult> {
    const query = `
      SELECT id, email, name, is_active, created_at, updated_at
      FROM user_list_view
      WHERE ($1::text IS NULL OR name ILIKE $1)
        AND ($2::boolean IS NULL OR is_active = $2)
      ORDER BY created_at DESC
      LIMIT $3 OFFSET $4
    `;

    const result = await this.database.query(query, [
      filters.name,
      filters.isActive,
      pagination.limit,
      pagination.offset,
    ]);

    return {
      users: result.map(row => ({
        id: row.id,
        email: row.email,
        name: row.name,
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })),
      total: result.length,
    };
  }
}
```

## Saga Pattern for Distributed Transactions

### Saga Orchestrator

```typescript
// lib/saga/saga-orchestrator.ts
export class SagaOrchestrator {
  private eventStore: EventStore;
  private eventBus: EventBus;
  private sagas: Map<string, Saga> = new Map();

  constructor(eventStore: EventStore, eventBus: EventBus) {
    this.eventStore = eventStore;
    this.eventBus = eventBus;
    this.setupEventHandlers();
  }

  async executeSaga(sagaId: string, sagaType: string, data: any): Promise<void> {
    const saga = this.sagas.get(sagaType);
    if (!saga) {
      throw new Error(`Saga type ${sagaType} not found`);
    }

    const sagaInstance = new saga(sagaId, data);
    await this.executeNextStep(sagaInstance);
  }

  private async executeNextStep(sagaInstance: Saga): Promise<void> {
    const step = sagaInstance.getCurrentStep();
    if (!step) {
      // Saga completed
      await this.eventStore.appendEvents(
        sagaInstance.id,
        [{
          type: 'SagaCompleted',
          data: { sagaId: sagaInstance.id, sagaType: sagaInstance.type },
          metadata: {},
          timestamp: new Date(),
          version: sagaInstance.version + 1,
        }],
        sagaInstance.version
      );
      return;
    }

    try {
      await step.execute();
      sagaInstance.markStepCompleted();
      await this.executeNextStep(sagaInstance);
    } catch (error) {
      await this.compensateSaga(sagaInstance, error);
    }
  }

  private async compensateSaga(sagaInstance: Saga, error: Error): Promise<void> {
    const compensationSteps = sagaInstance.getCompensationSteps();
    
    for (const step of compensationSteps.reverse()) {
      try {
        await step.compensate();
      } catch (compensationError) {
        console.error('Compensation failed:', compensationError);
      }
    }

    await this.eventStore.appendEvents(
      sagaInstance.id,
      [{
        type: 'SagaFailed',
        data: { sagaId: sagaInstance.id, error: error.message },
        metadata: {},
        timestamp: new Date(),
        version: sagaInstance.version + 1,
      }],
      sagaInstance.version
    );
  }

  private setupEventHandlers(): void {
    this.eventBus.subscribe('SagaStepCompleted', this.handleSagaStepCompleted.bind(this));
    this.eventBus.subscribe('SagaStepFailed', this.handleSagaStepFailed.bind(this));
  }

  private async handleSagaStepCompleted(event: SagaStepCompletedEvent): Promise<void> {
    const sagaInstance = await this.getSagaInstance(event.sagaId);
    if (sagaInstance) {
      await this.executeNextStep(sagaInstance);
    }
  }

  private async handleSagaStepFailed(event: SagaStepFailedEvent): Promise<void> {
    const sagaInstance = await this.getSagaInstance(event.sagaId);
    if (sagaInstance) {
      await this.compensateSaga(sagaInstance, new Error(event.error));
    }
  }
}
```

## Performance Optimization

### Event Batching

```typescript
// lib/events/event-batcher.ts
export class EventBatcher {
  private batchSize: number;
  private flushInterval: number;
  private batches: Map<string, Event[]> = new Map();
  private flushTimer: NodeJS.Timeout | null = null;

  constructor(batchSize: number = 100, flushInterval: number = 1000) {
    this.batchSize = batchSize;
    this.flushInterval = flushInterval;
  }

  async addEvent(streamId: string, event: Event): Promise<void> {
    if (!this.batches.has(streamId)) {
      this.batches.set(streamId, []);
    }

    this.batches.get(streamId)!.push(event);

    if (this.batches.get(streamId)!.length >= this.batchSize) {
      await this.flushStream(streamId);
    }

    if (!this.flushTimer) {
      this.flushTimer = setTimeout(() => this.flushAll(), this.flushInterval);
    }
  }

  private async flushStream(streamId: string): Promise<void> {
    const events = this.batches.get(streamId);
    if (!events || events.length === 0) return;

    this.batches.set(streamId, []);

    // Process events in batch
    await this.processBatch(streamId, events);
  }

  private async flushAll(): Promise<void> {
    for (const streamId of this.batches.keys()) {
      await this.flushStream(streamId);
    }

    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
  }
}
```

### Connection Pooling

```typescript
// lib/websocket/connection-pool.ts
export class ConnectionPool {
  private connections: Map<string, WebSocketConnection> = new Map();
  private maxConnections: number;
  private connectionTimeout: number;

  constructor(maxConnections: number = 1000, connectionTimeout: number = 30000) {
    this.maxConnections = maxConnections;
    this.connectionTimeout = connectionTimeout;
  }

  async addConnection(connectionId: string, connection: WebSocketConnection): Promise<void> {
    if (this.connections.size >= this.maxConnections) {
      await this.evictOldestConnection();
    }

    this.connections.set(connectionId, connection);
    this.setupConnectionHandlers(connectionId, connection);
  }

  private setupConnectionHandlers(connectionId: string, connection: WebSocketConnection): void {
    connection.on('close', () => {
      this.connections.delete(connectionId);
    });

    connection.on('error', (error) => {
      console.error(`Connection ${connectionId} error:`, error);
      this.connections.delete(connectionId);
    });

    // Set up timeout
    setTimeout(() => {
      if (this.connections.has(connectionId)) {
        connection.close();
        this.connections.delete(connectionId);
      }
    }, this.connectionTimeout);
  }

  private async evictOldestConnection(): Promise<void> {
    const oldestConnection = this.connections.values().next().value;
    if (oldestConnection) {
      oldestConnection.close();
    }
  }
}
```

## Testing Event-Driven Systems

### Event Testing Utilities

```typescript
// tests/event-testing.ts
export class EventTestHelper {
  private events: Event[] = [];

  async captureEvents(eventBus: EventBus): Promise<void> {
    eventBus.subscribe('*', (event: Event) => {
      this.events.push(event);
    });
  }

  getEventsByType(type: string): Event[] {
    return this.events.filter(event => event.type === type);
  }

  getEventsByStream(streamId: string): Event[] {
    return this.events.filter(event => event.streamId === streamId);
  }

  clearEvents(): void {
    this.events = [];
  }

  assertEventPublished(type: string, data?: any): void {
    const event = this.events.find(e => e.type === type);
    expect(event).toBeDefined();
    
    if (data) {
      expect(event!.data).toEqual(data);
    }
  }

  assertEventNotPublished(type: string): void {
    const event = this.events.find(e => e.type === type);
    expect(event).toBeUndefined();
  }
}

// Example test
describe('User Service Events', () => {
  let eventTestHelper: EventTestHelper;
  let userService: UserService;
  let eventBus: EventBus;

  beforeEach(() => {
    eventTestHelper = new EventTestHelper();
    eventBus = new EventBus();
    userService = new UserService(eventBus);
    eventTestHelper.captureEvents(eventBus);
  });

  it('should publish UserCreated event when user is created', async () => {
    await userService.createUser({
      id: '123',
      email: 'test@example.com',
      name: 'Test User',
    });

    eventTestHelper.assertEventPublished('UserCreated', {
      id: '123',
      email: 'test@example.com',
      name: 'Test User',
    });
  });
});
```

## Best Practices

### 1. Event Design
- Make events immutable and versioned
- Use clear, descriptive event names
- Include all necessary data in events
- Design for backward compatibility

### 2. Error Handling
- Implement retry mechanisms with exponential backoff
- Use dead letter queues for failed events
- Implement circuit breakers for external services
- Log and monitor all failures

### 3. Performance
- Batch events when possible
- Use connection pooling
- Implement caching strategies
- Monitor and optimize event processing

### 4. Monitoring
- Track event processing metrics
- Monitor system health and performance
- Set up alerts for failures
- Use distributed tracing

## Conclusion

Event-driven architecture with WebSockets and message queues provides a powerful foundation for building scalable, real-time applications. By following the patterns and best practices outlined in this guide, you can create robust systems that handle complex business logic while maintaining high performance and reliability within CreatorFlow.

Remember that EDA adds complexity, so start simple and gradually introduce more sophisticated patterns as your system grows. Focus on proper testing, monitoring, and error handling to ensure your event-driven system remains reliable and maintainable for CreatorFlow development.

---

**Next Steps for CreatorFlow:**
- Implement comprehensive event monitoring tailored for CreatorFlow
- Set up automated testing for CreatorFlow event flows
- Establish error handling and recovery procedures for CreatorFlow services
- Plan for event schema evolution within CreatorFlow
- Monitor system performance and optimize as needed for CreatorFlow applications
