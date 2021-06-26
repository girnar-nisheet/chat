import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { APIService } from '../services/api.service';

@Component({
	selector   : 'app-chatscreen',
	templateUrl: './chatscreen.component.html',
	styleUrls  : ['./chatscreen.component.scss']
})
export class ChatscreenComponent implements OnInit {
	to      : any;
	messages: Array<any> = [];

	constructor(
		private api   : APIService,
		private socket: Socket,
		private route : ActivatedRoute
	) { }

	ngOnInit(): void {
		this.route.params.subscribe(params => {
			console.log('Route params: ', params);
			this.to = params.id;
		});
		this.socket.on('new-message', (msg: any) => {
			console.log('Message received:: ', msg);
			this.messages.push(msg);
		});
		this.socket.on('old-messages', (msgs: any) => {
			this.messages = msgs;
		});
		this.socket.emit('get-old-messages');
	}

	sendMessage(msg: any) {
		console.log(msg);
		let message = {
			from     : this.socket.ioSocket.id,
			from_name: sessionStorage.getItem('username'),
			to       : this.to,
			message  : msg,
			timestamp: new Date()
		};
		this.messages.push(message);
		return this.socket.emit('message', message);
	}

}
