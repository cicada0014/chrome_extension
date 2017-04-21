import { EventEmitter, Injectable, Output } from '@angular/core';



export class FrameConfig {
    constructor(private width: string, private scale: string, private height: string) { };
    public setHeight(height) {
        this.height = height;
    }

    public setWidth(width) {
        this.width = width;

    }
    public setScale(scale) {
        this.scale = scale
    }
    public getHeight() {
        return this.height;
    }

    public getWidth() {
        return this.width
    }
    public getScale() {
        return this.scale;
    }
}


// NavBarService 는 헤더 상단바에서 발생한 이벤트를 라우팅된 outline 컴포넌트에 값을 전달하는 역할을 하는 서비스임. 

@Injectable()
export class NavBarService {

    public isLogin :boolean = false;

    public action: boolean = false;
    public isInput: boolean = false;
    public isTutorial: boolean = false;
    public frameConfig: FrameConfig;
    private ratioValue: number = 125;
    private scaleValue: number = 0.8;
    private TOTALVALUE: number = 100;

    public linkTabState: string;
    public editorTabState: string;

    constructor() {
        this.linkTabState = "deActive";
        this.editorTabState = "deActive";
        this.frameConfig = new FrameConfig(this.ratioValue + "%",
            "scale(" + this.scaleValue + ")",
            this.ratioValue + "vh");
    }

    public enterLinkTab(): void {
        this.linkTabState = "active";
    }

    public leaveLinkTab(): void {
        this.linkTabState = "deActive";
    }

    public enterEditorTab(): void {
        this.editorTabState = "active";
    }

    public leaveEditorTab(): void {
        this.editorTabState = "deActive";
    }
    public navAction() {
        this.action = this.action === false ? true : false;
    }
    public navInputFrame() {
        this.isInput = this.isInput === false ? true : false;
    }

    public enlargeFrame() {
        this.scaleValue += 0.1;
        this.frameConfigAct();
    }
    public reduceFrame() {
        this.scaleValue -= 0.1;
        this.frameConfigAct();
    }



    private frameConfigAct() {
        this.ratioValue = (this.TOTALVALUE / this.scaleValue)
        this.frameConfig.setScale("scale(" + this.scaleValue + ")");
        this.frameConfig.setWidth(this.ratioValue + "%");
        this.frameConfig.setHeight(this.ratioValue + "vh");

    }

    public getRatioValue() {
        return Math.round(this.scaleValue * 125);
    }
}