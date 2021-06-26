import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

	constructor(
		private socket: Socket,
		private router: Router
	) {}

	ngOnInit(): void {}

	proceed(username: any) {
		this.socket.emit('set-data', { username: username });
		sessionStorage.setItem('username', username);
		this.router.navigate(['/list']);
	}

}
