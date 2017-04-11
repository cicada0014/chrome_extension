import { EventEmitter, Injectable, Output } from '@angular/core';


@Injectable()
export class LinkSenderService {

    public sendURL: string = "http://www.google.com/";
    public sendAction(url:string) {
        this.sendURL = url;
        // test목적 naver.com
        console.log(this.sendURL);
    }


}