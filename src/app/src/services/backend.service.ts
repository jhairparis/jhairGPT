import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  private url = 'https://jhairparis.com/api';
  private http = inject(HttpClient);

  createNewChat(text: string) {
    return this.http.post(`${this.url}/gpt/new`, {
      message: text,
    });
  }

  initialiazeChat(chatId: string) {
    return this.http.post(`${this.url}/gpt`, {
      chatId: chatId,
      model: 'gemini-1.0-pro',
    });
  }

  getChat(chatId: string) {
    return this.http.get<any>(`${this.url}/gpt?id=${chatId}`);
  }

  chatting(message: string, chatId: string, model: string) {
    return this.http.put<any>(`${this.url}/gpt`, {
      message,
      chatId: chatId,
      model,
    });
  }
}
