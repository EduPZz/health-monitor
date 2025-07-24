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
      console.log('token:', token);
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
    } catch (e) {
      socket.disconnect();
    }
  }

  // Permite emitir evento para um usuário específico
  emitToUser(userId: number, event: string, data: any) {
    const sockets = this.userSockets.get(userId) || [];
    console.log(`Emitting to user ${userId}:`, event, data);
    for (const socket of sockets) {
      socket.emit(event, data);
    }
  }

  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string): string {
    console.log('Received via WS:', data);
    return `Echo: ${data}`;
  }
}
