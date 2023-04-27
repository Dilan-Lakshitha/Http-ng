import { Injectable } from "@angular/core";
import { HttpEvent,HttpInterceptor,HttpHandler,HttpRequest, HttpEventType, HttpResponse, HttpContextToken } from "@angular/common/http";
import { Observable, observable, of } from "rxjs";
import { tap } from "rxjs/operators";
import { HttpCacheService } from "./http-cache.service";

export const CACHEABLE = new HttpContextToken(()=>true);

@Injectable()
export class CacheInterceptor implements HttpInterceptor{
    constructor(private cacheservices:HttpCacheService){}
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        //only cache requests configured to be cacheable
        if (!req.context.get(CACHEABLE)){
            return next.handle(req);
        }



        //pass along non-cacheable requests and invalidate cache

        if(req.method !=='get'){
            console.log(`Invalidating cache: ${req.method} ${req.url}`);
            this.cacheservices.invalidateCache();
            return next.handle(req);
        }

        //attemt to retrieve a cached response 

        const cachedResponse: HttpResponse<any>=this.cacheservices.get(req.url);
        //return cached reponse 

        if (cachedResponse){
            console.log(`Returning a cached reponse : ${ cachedResponse.url}`);
            console.log(cachedResponse);
            return of(cachedResponse);
        }
        //send request to server and add reponse to cache

        return next.handle(req).pipe(
            tap(event=>{
                if ( event instanceof HttpResponse){
                    console.log(`Adding item to cache: ${req.url}`);
                    this.cacheservices.put(req.url,event);
                }
            })
        )
    }
}