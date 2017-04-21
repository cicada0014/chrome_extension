


import { Component, Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({ selector: '[keyMap]' })
export class KeymapDirective {
    //단축키 적용대상의 키코드를 받아온다.
    @Input() keyCode: string;
    @Input() isAltKey: string;
    @Input() isCtrKey: string;
    @Input() isShiftKey: string;


    // 이 지시자의 사용법 : dom 엘리먼트에 다음과 같은 내용을 추가 하면 된다.
    //<element keyMap [keyCode]="keymap.keycode" [isCtrKey]="'false'"  [isAltKey]="'true'" (keyAction)="keyAction()"> </element>
    //         지시자를 추가해주고 사용할 keycode를 입력해준다. keymap 값 제공자가 전역에 주입되어 있으므로 그냥 불러오면 된다. 
    // alt , ctr 등 다른 동작키는 기본적으로 false이다. alt 키를 추가해주면 된다. 아직 중첩 동작키는 만들지 않았다
    //  마지막으로 keyaction 부분에 실행하고자 하는 컴포넌트의 메소드를 바인딩해주면 된다. 


    

    //눌러진 키랑 키코드가 동일하면 해당 메소드를 실행할 동작 이벤트를 던져준다. 
    @Output() keyAction = new EventEmitter<Object>();
    constructor() { }

    // window 전역에서 눌린 키에 대해서 움직이도록 한다. 일반 키

    @HostListener('window:keydown', ['$event']) onkeydown($event : KeyboardEvent) {
        // 에디터의 키맵과 충돌방지를 위해 펑션키를 제외하고는 전부 다른 동작키가 있도록 함.
        if ($event.altKey && this.isAltKey === "true") {
            if ($event.keyCode+"" === this.keyCode) {
                this.keyAction.emit();
            }
        } else if ($event.ctrlKey && this.isCtrKey === "true") {
            if ($event.keyCode+'' === this.keyCode) {
                this.keyAction.emit();
            }

        } else if ($event.shiftKey && this.isShiftKey === "true") {
            if ($event.keyCode+'' === this.keyCode) {
                this.keyAction.emit();
            }

        } else if (112 <= $event.keyCode && $event.keyCode <= 123) {
            if ($event.keyCode+'' === this.keyCode) {
                
                this.keyAction.emit();
            }

        }

    }


}

