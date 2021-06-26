import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API = 'http://localhost:3000';

@Injectable()
export class APIService {
    constructor(private http: HttpClient) { }

    getLiveUsers(): Observable<any> {
        return this.http.get(`${API}/live/users`);
    }

    getLiveRooms(id: string): Observable<any> {
        return this.http.get(`${API}/live/user/${id}/rooms`);
    }

}