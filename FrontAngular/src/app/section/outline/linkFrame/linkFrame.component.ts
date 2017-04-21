import { NavBarService } from '../../../shared/nav-bar.service';
import { LinkSenderService } from '../../../shared/link-sender.service';
import { Observable } from 'rxjs/Observable';

import { LinkFrameService } from './linkFrame.service.promise';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import {
  animate,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer,
  state,
  style,
  transition,
  trigger,
  ViewChild
} from '@angular/core';

import { DragulaService, dragula } from 'ng2-dragula/ng2-dragula';




declare var $: any;
@Component({
  selector: 'linkFrame',
  templateUrl: 'linkFrame.component.html',
  styleUrls: ['linkFrame.component.css'],
  providers: [LinkFrameService],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translate3d(-100%, 0, 0)'
      })),
      state('out', style({
        transform: 'translate3d(0, 0, 0)'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ]),
  ]
})
export class linkFrameComponent implements OnInit {
  @Input() iframeHeight: string = '200vh';
  @Input() iframeWidth: string = '200%';
  @Input() iframeScale: string = 'scale(0.5)'; //scale(0.0)
  @Input() iframeOpacity: number;
  result: Observable<string[]>;


  // private iframeRatio = '300%';
  private state: string = 'close';

  @Output() urlInfomation = new EventEmitter<string>();
  @Output() dragStartEmit = new EventEmitter();
  //  sanitization 을 통과한 url을 만들기 위한 변수
  trustResourceURL: SafeResourceUrl;
  private linkUrl: string = '';
  private urlChecker: string;

  @ViewChild('usedFrame') iframeHtml: ElementRef;


  constructor(private _sanitizer: DomSanitizer, private connectService: LinkFrameService, private rd: Renderer,
    private dragulaService: DragulaService, private linkSendService: LinkSenderService, public navService: NavBarService) {

    // 맨 처음 띄워줄 화면
    // this.linkUrl = "http://www.google.com/";
    this.urlChecker = this.linkUrl;

    // sanitization 을 통과해야 angular app 에서 쓸 수 있다.
    this.trustResourceURL = this._sanitizer.bypassSecurityTrustResourceUrl(this.linkUrl);



  }

  dragStart($event){
    this.dragStartEmit.emit($event);
  }

  pageGet() {


    this.urlInfomation.emit(this.linkUrl);




    // var xhr = new XMLHttpRequest();
    // var url = "https://www.google.com";

    // xhr.open('GET', url, true);
    // xhr.onload = (result:any) => {
    //   this.iframeHtml.nativeElement.contentWindow.document.open()
    //   this.iframeHtml.nativeElement.contentWindow.document.write(result.currentTarget.response)
    //   console.log(this.iframeHtml.nativeElement.contentWindow.document);
    //   console.log($('body',this.iframeHtml.nativeElement.contentWindow.document));

    //   this.iframeHtml.nativeElement.contentWindow.document.close()

    // }
    // xhr.send();



  }

  // iframe의 url을 바꾼다.
  onEnter(inputUrl: string) {
    this.linkUrl = inputUrl;
    var urlPattern = new RegExp('^(?:https?):\/\/');
    if (urlPattern.test(inputUrl)) {
      this.trustResourceURL = this._sanitizer.bypassSecurityTrustResourceUrl(this.linkUrl);
      
    } else {
      this.trustResourceURL = this._sanitizer.bypassSecurityTrustResourceUrl("http://" + this.linkUrl);
      this.linkUrl = "http://" + this.linkUrl;
    }
  }

  ngOnInit() {
  }


  private menuState: string = 'in';

  toggleMenu() {
    // 1-line if statement that toggles the value:
    this.menuState = this.menuState === 'out' ? 'in' : 'out';
  }


  // this.trustHtml= this._sanitizer.bypassSecurityTrustHtml(
  // this.rd.selectRootElement(this.iframeCmp.nativeElement).contentWindow.postMessage('','*'));
  // let drake = dragula([this.trustHtml,this.makeit.nativeElement]);
  //  iframe 내부로 접근하는 방법은 현재 막혀 있다. 보안 문제를 더 공부하고 도전해야 겠다.


  ngAfterViewInit() {


  }

  ngAfterContentChecked() {
    

    // console.log(this.linkSendService.sendURL);
    if (this.urlChecker !== this.linkSendService.sendURL) {
      this.linkUrl = this.linkSendService.sendURL;
      var urlPattern = new RegExp('^(?:https?):\/\/');
      console.log(this.linkSendService.sendURL);
      this.trustResourceURL = this._sanitizer.bypassSecurityTrustResourceUrl(this.linkSendService.sendURL);
      this.urlChecker = this.linkSendService.sendURL;
    }
  }
}