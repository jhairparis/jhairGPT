import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

function getCookie(name:string) {
    let cookieArr = document.cookie.split(";");
    for (let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split("=");
        if (name == cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return null;
}

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  private url = 'https://jhairparis.com/api';
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
