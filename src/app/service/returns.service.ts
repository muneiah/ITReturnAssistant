import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Year} from '../model/year';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from '../model/user';

@Injectable()
export class ReturnsService {

  private static url = 'http://localhost:8888/';


  constructor(private http: HttpClient) { }

  public static typesOfSavings: String[] = ['LIC', 'Public Provident Fund', 'Deposit in NSC', 'Home Loan Principal Amount', 'Unit Linked Insurance Plan(ULIP)', 'Eligible Mutual Funds', 'Children Educational Expenses', 'Fixed Deposit', 'Other'];
  public static sodexoAmounts: number[] = [1100, 2200];

  getYears(): Observable<Year[]> {
    return this.http.get<Year[]>(ReturnsService.url + 'getYears');
  }

  getUser(id: string, password: string): Observable<User> {
    return this.http.post<User>(ReturnsService.url + 'getUser?id=' + id, password);
  }

  saveUser(user: User): Observable<Boolean> {
    return this.http.post<Boolean>(ReturnsService.url + 'saveUser', user);
  }

}
