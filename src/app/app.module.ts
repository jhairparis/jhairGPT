import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { NgIconsModule } from '@ng-icons/core';
import {
  ionSunnySharp,
  ionAnalytics,
  ionWarningOutline,
  ionSendSharp,
  ionAdd,
  ionPersonOutline,
  ionChatboxOutline,
  ionEllipsisHorizontal,
} from '@ng-icons/ionicons';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { ChatComponent } from './chat/chat.component';
import { MessagesComponent } from './messages/messages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ViewChatsComponent } from './view-chats/view-chats.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
  declarations: [AppComponent, NavComponent, ChatComponent, MessagesComponent, DashboardComponent, ViewChatsComponent, PageNotFoundComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgIconsModule.withIcons({
      ionSunnySharp,
      ionAnalytics,
      ionWarningOutline,
      ionSendSharp,
      ionAdd,
      ionPersonOutline,
      ionChatboxOutline,
      ionEllipsisHorizontal,
    }),
  ],

  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
