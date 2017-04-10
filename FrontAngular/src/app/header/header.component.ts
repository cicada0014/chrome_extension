import { ChromeExtensionService } from '../shared/chrome-extension.service';
import { KeymapService, ShortKey } from '../shared/keymap/keymap.service';
import { Router, UrlTree } from '@angular/router';
import { NavBarService } from '../shared/nav-bar.service';
import {
    animate,
    Component,
    ElementRef,
    EventEmitter,
    OnInit,
    Output,
    Renderer,
    state,
    style,
    transition,
    trigger
} from '@angular/core';

@Component({
    selector: 'header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.css'],
    animations: [
        trigger(
            'showLoginModal',
            [
                // transform 속성은 위치의 변경을 의미한다. translate3d 함수는 x,y,z축의 움직임을 나타내는데 음수값도 허용한다. 
                // 초기에 width 와 height 값을 0으로 지정해서 보이지 않도록 한다.
                state('deActive', style({ opacity: 0, transform: 'translateX(100%)' })),
                state('active', style({ opacity: 1 })),
                transition('deActive <=> active', animate(500)),
            ]
        ),
    ]
})
export class HeaderComponent implements OnInit {
    /**
     * 전반적인 클래스에 대한 주석
     * @file header.component.ts 
     * @author youngtae 2017.02.01
     * @brief 상단바 관련 컴포넌트이다. 
     * @see 참고사항 
     * @todo 추가적으로 해야할 사항
     */



    @Output() lockAction = new EventEmitter<Object>();
    isLinkFrameActivated: boolean = false;

    private isFullScreen: boolean = false;
    isShowLoginModal: string;
    private loginModalHeight: string;
    isHelpActive: boolean;
    private settingUrl: UrlTree;
    private keymap: ShortKey[];
    private frameRatio: string = '100%';
    private saveState: string;
    fontColor = "grey-text";
    backGrondColor = "grey lighten-4";
    constructor(
        private el: ElementRef,
        private renderer: Renderer,
        private keymapService: KeymapService,
        private navService: NavBarService,
        private router: Router,
        public chromeService: ChromeExtensionService
    ) {

        this.isHelpActive = false;
        this.isShowLoginModal = 'deActive';
        // this.keymapService
        this.keymap = this.keymapService.getKeymap();

    }

    showLoginModal($event) {
        if ($event === undefined) {
            this.isShowLoginModal = (this.isShowLoginModal === 'active') ? 'deActive' : 'active';
        } else {
            if (!$event.target.classList.contains('area')) {
                this.isShowLoginModal = (this.isShowLoginModal === 'active') ? 'deActive' : 'active';
            }
        }
    }

    findShortKeyCode(keyName: string): string {
        let memo = this.keymap.find(shortkey => {
            if (shortkey.getKeyName() === keyName) {
                return true;
            } else {
                return false;
            }
        });
        if (memo) {
            return memo.getKeyCode();
        } else {
        }

    }

    ngAfterContentChecked() {
        if (this.saveState === this.chromeService.getSavedState()) {

        } else {
            this.saveState = this.chromeService.getSavedState()
        }
    }

    ngOnInit() {
    }


    openWith() {
        if (!this.isFullScreen) {
            this.isFullScreen = true;
            document.body.webkitRequestFullScreen();
             
        }else{
            this.isFullScreen = false;
            document.webkitCancelFullScreen();
        }
    }
    openHelp() {
        this.isHelpActive = this.isHelpActive ? false : true;
    }
    headerFix() {
        this.navService.navAction();
        this.lockAction.emit();
    }
    createLinkFrame() {
        this.navService.navInputFrame();
        this.isLinkFrameActivated = this.isLinkFrameActivated ? false : true;
    }
    goSetting() {
        
    }
    enlargeFrame() {
        this.navService.enlargeFrame();
        this.frameRatio = this.navService.getRatioValue() + "%";
    }
    reduceFrame() {
        this.navService.reduceFrame();
        this.frameRatio = this.navService.getRatioValue() + "%";
    }
    goEditor() {
        this.settingUrl = this.router.createUrlTree(['3ndEditor']);
        this.router.navigateByUrl(this.settingUrl);

    }

}