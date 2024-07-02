import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private url = environment.apiUrl;
  private http = inject(HttpClient);

  getChat(chatId: string) {
    return this.http.get<any>(`${this.url}/gpt?id=${chatId}`);
  }

  initialiazeChat(message: string, model: string) {
    return this.http.post(
      `${this.url}/gpt`,
      {
        message: message,
        model: model,
      },
      {
        withCredentials: true,
      }
    );
  }

  chatting(message: string, chatId: string, model: string) {
    return this.http.put<any>(`${this.url}/gpt`, {
      message,
      chatId: chatId,
      model: model,
    });
  }
}
