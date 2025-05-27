import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable } from 'rxjs';
import IChatMessage from "../../shared/models/IChatMessage";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AssistantService {
  private socket$: WebSocketSubject<IChatMessage>;
  private readonly WS_ENDPOINT: string;

  constructor() {
    // Use environment variable for the endpoint
    this.WS_ENDPOINT = `${environment.wsUrl}/assistant`
    // this.WS_ENDPOINT = `ws://localhost:8084`

    this.socket$ = this.getNewWebSocket();
  }

  private getNewWebSocket(): WebSocketSubject<IChatMessage> {
    return webSocket({
      url: this.WS_ENDPOINT,
      serializer: msg => JSON.stringify(msg), // Explicit serialization
      deserializer:  ({data}) => {
        try {
          return JSON.parse(data); // Try parsing as JSON first
        } catch (e) {
          return { // Fallback for plain text messages
            type: 'assistant',
            payload: data
          };
        }
      },
      openObserver: {
        next: () => console.log('[AssistantService]: WebSocket connected!'),
      },
      closeObserver: {
        next: () => {
          console.log('[AssistantService]: WebSocket disconnected!');
          // Add automatic reconnection
          setTimeout(() => this.reconnect(), 3000);
        }
      },
    });
  }

  private reconnect(): void {
    console.log('Attempting to reconnect...');
    this.socket$ = this.getNewWebSocket();
  }

  sendMessage(message: string): void {
    const userMessage: IChatMessage = {
        type: 'user',
        payload: message
    };
    this.socket$.next(userMessage);
  }

  getAssistantMessages(): Observable<IChatMessage> {
    return this.socket$.asObservable();
  }

  closeConnection(): void {
    this.socket$.complete();
  }
}
