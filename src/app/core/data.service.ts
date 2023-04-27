import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { allBooks, allReaders } from 'app/data';
import { Reader } from "app/models/reader";
import { Book } from "app/models/book";
import { BookTrackerError } from 'app/models/bookTrackerError';
import { OldBook } from 'app/models/oldBook';
import { environment } from 'environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  mostPopularBook: Book = allBooks[0];

  setMostPopularBook(popularBook: Book): void {
    this.mostPopularBook = popularBook;
  }

  getAllReaders(): Reader[] {
    return allReaders;
  }

  getReaderById(id: number): Reader {
    return allReaders.find(reader => reader.readerID === id);
  }
  

  //Retriving a Collection
  getAllBooks(): Observable<Book[]| BookTrackerError> {
    console.log('Getting sll books from the server.');
    return this.http.get<Book[]>(`/api/books`, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': 'my-token'
      })
    })
    .pipe(
      catchError(err => this.handleHttpError(err))
    );
  }
  
  //Handling Http Errors
  private handleHttpError(error : HttpErrorResponse):Observable<BookTrackerError>{
    let dataError = new BookTrackerError();
    dataError.errorNumber = 100;
    dataError.message = error.statusText;
    dataError.friendlyMessage = 'An error Occured retrieving data.';
    return throwError(dataError);
  }

  //Retrvieving a Single Item
  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`/api/books/${id}`, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': 'my-token'
      })
    });
  }

  getOldBookById(id: number): Observable<OldBook> {
    return this.http.get<Book>(`/api/books/${id}`)
      .pipe(
        map(b => <OldBook>{
          bookTitle: b.title,
          year: b.publicationYear
        }),
        tap(classicBook => console.log(classicBook))
      );
  }

  //Insert
  addBook(newBook: Book): Observable<Book> {
    return this.http.post<Book>('/api/books', newBook, {
      headers: new HttpHeaders({
        'Content-Type' : 'application/json'
      })
    });
  }

  //Update
  updateBook(updatedBook: Book): Observable<void> {
    return this.http.put <void>(`/api/books/${updatedBook.bookID}`, updatedBook, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  //Delete
  deleteBook(bookID: number): Observable<void> {
    return this.http.delete<void>(`/api/books/${bookID}`);
  }

}