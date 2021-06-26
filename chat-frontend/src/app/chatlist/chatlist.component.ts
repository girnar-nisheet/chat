import { Component, Inject, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { APIService } from '../services/api.service';
import * as fa from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

export interface RoomData {
	liveUsers : Array<any>,
}

@Component({
	selector: 'app-chatlist',
	templateUrl: './chatlist.component.html',
	styleUrls: ['./chatlist.component.scss']
})
export class ChatlistComponent implements OnInit {
	fa = fa;
	liveUsers: Array<any> = [];
	liveRooms: Array<any> = [];
	
	constructor(
		private api: APIService,
		private socket: Socket,
		private router: Router,
		private dialog: MatDialog
	) {
	}

	ngOnInit() {
		setTimeout(() => {
			this.updateLiveList();
		}, 500);
		this.socket.on('user-changes', this.updateLiveList.bind(this));
	}

	updateLiveList() {
		this.api.getLiveUsers().subscribe(resp => {
			console.log('Live Users: ', resp);
			this.liveUsers = resp.data.filter((user: any) => user['id'] != this.socket.ioSocket.id);
		});
		this.api.getLiveRooms(this.socket.ioSocket.id).subscribe(resp => {
			console.log('Live rooms: ', resp);
			this.liveRooms = resp.data;
		});
	}

	onChatClick(user: any) {
		console.log('Socket ID: ', this.socket.ioSocket.id);
		console.log('Navigate to chat: ', user);
		this.router.navigate([`/chat/${user.id}`]);
	}

	onRoomClick(room: any) {
		console.log('Socket ID: ', this.socket.ioSocket.id);
		console.log('Navigate to room: ', room);
		this.router.navigate([`/room/${room.id}`]);
	}

	createRoom() {
		const dialogRef = this.dialog.open(DialogCreateRoom, {
			width: '500px',
			data: { 
				liveUsers : this.liveUsers,
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			console.log('The dialog was closed: ', result);
			if (!result) return;
			this.socket.emit('create-room', result);
		});
	}

}

@Component({
	selector: 'dialog-create-room',
	template: `
		<form name="createGroup">
			<h1 mat-dialog-title>Create Group</h1>
			<div mat-dialog-content>
				<mat-form-field style="width:100%" appearance="fill">
					<mat-label>Name</mat-label>
					<input matInput [formControl]="name" placeholder="Enter a name" required>
					<mat-error *ngIf="name.hasError('required')">
						Please enter a name
					</mat-error>
				</mat-form-field>
				<mat-form-field style="width:100%" appearance="fill" required>
					<mat-label>Choose users to add in Group</mat-label>
					<mat-select [formControl]="users" multiple>
						<mat-option *ngFor="let user of data.liveUsers" [value]="user.id">{{user.name}}</mat-option>
					</mat-select>
					<mat-error *ngIf="name.hasError('required')">
						Please choose user(s)
					</mat-error>
				</mat-form-field>
			</div>
			<div mat-dialog-actions>
				<button mat-button (click)="onNoClick()">Cancel</button>
				<button mat-button color="primary" [disabled]="name.hasError('required') || users.hasError('required')" [mat-dialog-close]="{ name: name.value, users: users.value }" cdkFocusInitial>Ok</button>
			</div>
		</form>
	`,
})
export class DialogCreateRoom {
	name  = new FormControl('', [ Validators.required ]);
	users = new FormControl('', [ Validators.required ]);

	constructor(
		public dialogRef: MatDialogRef<DialogCreateRoom>,
		@Inject(MAT_DIALOG_DATA) public data: RoomData) { }

	onNoClick(): void {
		this.dialogRef.close();
	}

}