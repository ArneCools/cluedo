import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Card} from '../components/make-suggestion/make-suggestion.component';
import {catchError, retry, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MakeSuggestionService {
  private readonly URL = `${environment.apiUrl}/game`;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient) { }

  getAllCards(): Observable<Card[]> {
    return this.httpClient.get<Card[]>(`${this.URL}/cards`).pipe(retry(3));
  }

  makeSuggestion(suggestionCards: string) {
    console.log(suggestionCards);
    return this.httpClient.post(`${this.URL}/suggestion`, { suggestionCards }, this.httpOptions );
  }

}
