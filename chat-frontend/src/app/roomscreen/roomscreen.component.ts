import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { APIService } from '../services/api.service';

@Component({
  selector   : 'app-roomscreen',
  templateUrl: './roomscreen.component.html',
  styleUrls  : ['./roomscreen.component.scss']
})
export class RoomscreenComponent implements OnInit {
  to: any;
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
    this.socket.on('new-group-message', (msg: any) => {
      console.log('Message received:: ', msg);
      this.messages.push(msg);
    });
  }

  sendMessage(msg: any) {
    console.log(msg);
    let message = {
      roomId   : this.to,
      from     : this.socket.ioSocket.id,
      from_name: sessionStorage.getItem('username'),
      to       : this.to,
      message  : msg,
      timestamp: new Date()
    };
    this.messages.push(message);
    return this.socket.emit('group-message', message);
  }

}
