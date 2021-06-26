import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';

import { APIService } from './services/api.service';
import { ChatscreenComponent } from './chatscreen/chatscreen.component';
import { ChatlistComponent, DialogCreateRoom } from './chatlist/chatlist.component';
import { LoginComponent } from './login/login.component';
import { RoomscreenComponent } from './roomscreen/roomscreen.component';

const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
	declarations: [
		AppComponent,
		ChatscreenComponent,
		ChatlistComponent,
		LoginComponent,
		DialogCreateRoom,
  RoomscreenComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		SocketIoModule.forRoot(config),
		BrowserAnimationsModule,
		MatListModule,
		MatCardModule,
		MatDialogModule,
		MatFormFieldModule,
		MatButtonModule,
		MatInputModule,
		MatSelectModule,
		MatToolbarModule,
		FontAwesomeModule,
	],
	providers: [APIService],
	bootstrap: [AppComponent]
})
export class AppModule { }
