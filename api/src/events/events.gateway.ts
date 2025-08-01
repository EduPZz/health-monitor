import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  ConnectedSocket,
} from '@nestjs/websockets';
import { EventsService } from './events.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { AuthService } from '../auth/auth.service';
import { Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection {
  private userSockets = new Map<number, Socket[]>();

  constructor(
    private readonly eventsService: EventsService,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async handleConnection(@ConnectedSocket() socket: Socket) {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers['authorization'];
      if (!token) {
        console.error('No token provided');
        socket.disconnect();
        return;
      }
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      const userId = payload.sub;
      if (!userId) {
        console.error('Invalid token payload');
        socket.disconnect();
        return;
      }

      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, []);
      }
      this.userSockets.get(userId).push(socket);

      socket.on('disconnect', () => {
        const sockets = this.userSockets.get(userId) || [];
        this.userSockets.set(
          userId,
          sockets.filter((s) => s.id !== socket.id),
        );
      });

      (socket as any).userId = userId;
    } catch {
      socket.disconnect();
    }
  }

  // Permite emitir evento para um usuário específico
  emitToUser(userId: number, event: string, data: any) {
    const sockets = this.userSockets.get(userId) || [];
    for (const socket of sockets) {
      socket.emit(event, data);
    }
  }

  // Emit event to all companions of a user
  async emitToCompanions(userId: number, event: string, data: any) {
    const companions = await this.eventsService.getUserCompanions(userId);
    for (const companion of companions) {
      this.emitToUser(companion.accompanyingId, event, data);
    }
  }

  // Emit exercise events to companions
  async emitExerciseToCompanions(userId: number, event: string, data: any) {
    const companions = await this.eventsService.getUserCompanions(userId);
    for (const companion of companions) {
      this.emitToUser(companion.accompanyingId, event, {
        ...data,
        userId,
        timestamp: new Date().toISOString(),
      });
    }
  }

  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string): string {
    return `Echo: ${data}`;
  }
}
