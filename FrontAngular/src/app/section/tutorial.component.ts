import { NavBarService } from '../shared/nav-bar.service';
import { Component, OnInit, trigger, state, style, animate, transition } from '@angular/core';

@Component({
    selector: 'tutorial',
    templateUrl: 'tutorial.component.html',
    styleUrls: ['tutorial.component.css'],
    animations: [
        trigger(
            'scanTitle',
            [
                state('0', style({ top: "55%", left: "50%" })),
                state('1', style({ left: "85%", width: "15%" })),
                state('2', style({ left: "0%", width: "20%" })),
                state('3', style({ top: "15%", left: "96%", width: "4%" })),
                state('4', style({ top: "15%", left: "0%", width: "4%" })),
                state('5', style({ top: "8%", left: "40%" ,width:"10%" })),
                state('6', style({ top: "55%", left: "50%" })),
                transition('0 <=> 1', animate('1s ease')),
                transition('1 <=> 2', animate('1s ease')),
                transition('2 <=> 3', animate('1s ease')),
                transition('3 <=> 4', animate('1s ease')),
                transition('4 <=> 5', animate('1s ease')),
                transition('5 <=> 6', animate('1s ease')),
            ]
        ),
    ]
})
export class TutorialComponent implements OnInit {

    spotlight: number = 0;
    tutoDescription: string = "간단한 기능 소개를 해드릴게요. 클릭하세요!";
    tutoIndex: boolean = false;
    constructor(private navService: NavBarService) { }

    ngOnInit() { }
    ngAfterViewInit() {

    }
    closeTutorial(){
        this.navService.isTutorial = false;
    }
    tutorial() {
        this.spotlight++;
        switch (this.spotlight) {
            case 0: this.tutoDescription = "둘러보기"

                break;
            case 1:
                this.tutoDescription = "웹페이지 보기, 로그아웃,"
                    + "풀스크린, 상단바 제거 기능을 사용 할 수 있어요.";
                    
                this.navService.navInputFrame();
                break;
            case 2:
                this.tutoDescription =
                    "현재 파일이름과 저장상태를 볼 수 있습니다. "
                break;
            case 3:
                this.tutoDescription = "구글 드라이브에 저장하고 불러올 수 있는 기능이 있습니다. ";
                setTimeout(() => {
                    this.navService.enterEditorTab()
                }, 500);

                break;
            case 4:
                this.tutoDescription = "북마크 페이지를 볼 수 있어요. "

                this.navService.leaveEditorTab();
                setTimeout(() => {
                    this.navService.enterLinkTab();
                }, 500);
                break;
            case 5:
                this.tutoDescription = "페이지 텍스트와 이미지를 가져오고, 페이지크기를 조절할 수 있어요"
                this.navService.leaveLinkTab();
                break;
            case 6:
                this.spotlight = 0;
                
                this.tutoDescription = "지금 바로 이용해보세요! "
                setTimeout(() => {
                    this.navService.isTutorial = false;
                }, 1000);
                break;
        }


    }
}