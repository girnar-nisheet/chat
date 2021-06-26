import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'chat-frontend';
  constructor (
    private socket: Socket,
		private router: Router
  ) {
		let username = sessionStorage.getItem('username');
    if (username) {
      this.socket.emit('set-data', { username: username });
      this.router.navigate(['/list']);
    }
  }
}
