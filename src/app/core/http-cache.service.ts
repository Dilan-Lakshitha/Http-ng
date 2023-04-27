import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpCacheService {

  private requests: any={}

  constructor() { }
  //request from url and HTTP response from cached
  put( url: string,response:HttpResponse<any>):void{
    this.requests[url]=response;
  }
  //get item from cache
  get(url:string):HttpResponse<any>|undefined{
    return this.requests[url];
  }
  //having a invalid url from customer
  invalidateUrl(url:string):void{
    this.requests[url]=undefined;
  }
  //having a empty massage from client
  invalidateCache(){
    this.requests={};
  }
}
