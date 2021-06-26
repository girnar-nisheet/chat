import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatlistComponent } from './chatlist/chatlist.component';
import { ChatscreenComponent } from './chatscreen/chatscreen.component';
import { LoginComponent } from './login/login.component';
import { RoomscreenComponent } from './roomscreen/roomscreen.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'list',
    component: ChatlistComponent
  },
  {
    path: 'chat/:id',
    component: ChatscreenComponent
  },
  {
    path: 'room/:id',
    component: RoomscreenComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
