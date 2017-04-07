import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'section',
    template: `
    <setting *ngIf=""></setting>
    <router-outlet></router-outlet>
    `
})
export class SectionComponent implements OnInit {
    /**
     * 전반적인 클래스에 대한 주석
     * @file app.component.ts 
     * @author youngtae 2017.02.09
     * @brief router를 통해 필요한 정보들을 불러올수 있는 특수한 용도의 컴포넌트이다.
     * @see 라우터 아웃렛만을 가지고 있으며 여러 가드들과 함께 조건 동작을 수행한다.
     * @todo 추가적으로 해야할 사항
     */

    constructor() { }

    ngOnInit() {

    }

}