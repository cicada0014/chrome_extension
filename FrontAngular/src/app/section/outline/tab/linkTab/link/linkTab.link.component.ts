import { ChromeExtensionService } from '../../../../../shared/chrome-extension.service';
import { LinkSenderService } from '../../../../../shared/link-sender.service';
import { Links } from './links';
import { FormsModule } from '@angular/forms';
import { Link } from './link';
import { MockService } from '../mock/mock.service';
import { Component, EventEmitter, OnInit, Output, Provider } from '@angular/core';
import { DragulaService, dragula } from 'ng2-dragula/ng2-dragula';


@Component({
    selector: "linkPack",
    templateUrl: 'linkTab.link.component.html',
    styleUrls: ['linkTab.link.component.css'],
    providers: [MockService]
})
export class LinkComponent {
    /**
    * @file linkTab.link.component.ts
    * @author KimTaemin 17/02/08
    * @brief to show Link
    * @see 
    * @todo intersect with server, make method
    */

    // 서버 Json을 받는 리스트 맴버
    listLinks: Links[] = [];

    // 템플릿에 binding할 리스트 맴버
    listLinkFixed: Link[];
    listLinkUnfixed: Object[];
    title: string;

    constructor(
        private linkService: MockService,
        private linkSendService: LinkSenderService,
        private chromeService: ChromeExtensionService) {


    }

    ngAfterViewInit() {
        // 목객체의 정보를 받음.
        this.listLinks = this.linkService.getLink();
        this.chromeService.getBookMarkList().then(bmArr => {
            this.listLinkUnfixed = bmArr;
        });
        this.listLinkFixed = this.listLinks[0].links;
        // this.listLinkUnfixed = this.listLinks[1].links;
    }

    public consoleEvent() {
        // console.log("고정링크" + this.listLinkFixed[0].fixed[1] + this.listLinkFixed[0].url + "/" + this.listLinkFixed[1].fixed[1] + this.listLinkFixed[1].url);
        // console.log("//////////////");
        // console.log("비고정링크" + this.listLinkUnfixed[0].fixed[1] + this.listLinkUnfixed[0].url + "/" + this.listLinkFixed[1].fixed[1] + this.listLinkFixed[1].url);
    }

    bookMarkMapper(bmArr: Object[]) {
        bmArr.forEach(bookMark => {

        })
    }

    getTitle(url: string) {

    }

    // openURL(url:string){
    //     console.log(url+"을 로드합니다.")
    // }

    // url을 LinkSenderService를 통해 iframe으로 전달함.
    sendURL(url: string) {
        this.linkSendService.sendAction(url);
    }
}