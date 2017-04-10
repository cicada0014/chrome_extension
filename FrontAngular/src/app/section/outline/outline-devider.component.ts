
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'inner-devider',
    template: '<span style="width : 100%; opacity:0; height : 90vh">뭔데 </span>'
})
export class InnerDeviderComponent implements OnInit {
    constructor() { }

    ngOnInit() { }
}


@Component({
    selector: 'devider',
    template: `
        <inner-devider (click)="noAction()">this is devider!</inner-devider>

    `

})
export class OutlineDeviderComponent implements OnInit {
    constructor() {

    }

    noAction() {

    }

    ngOnInit() {

    }
}