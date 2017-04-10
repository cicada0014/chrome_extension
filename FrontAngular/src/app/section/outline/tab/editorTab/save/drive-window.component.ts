import { ChromeExtensionService } from '../../../../../shared/chrome-extension.service';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer } from '@angular/core';
declare var $: any;
declare var Materialize: any;
@Component({
    selector: 'drive-window',
    templateUrl: 'drive-window.component.html',
    styleUrls: ['drive-window.component.css']
})
export class DriveWindowComponent implements OnInit {
    private newFileName: string;
    private isOpen: boolean = false;
    private files: Array<Object>;
    isActiveSearch: boolean;
    isSelectedTab: number = 1;
    saveProcessState: string = "";
    isExistingFileSelected: string = "blue-grey lighten-4";
    isNewFileSelected: string = "blue-grey lighten-4"
    private isCompletedGetList: boolean = false;
    @Input() editorElement: ElementRef;
    constructor(private chromeService: ChromeExtensionService, private renderer: Renderer) {
        this.isActiveSearch = false;
        this.files = [{
            iconLink: "",
            id: "",
            name: "",
            webContentLink: ""
        }];
    }

    ngOnInit() {

        this.files = [];
        for (let i = 0; i < 20; i++) {
            this.files.push({
                name: i
            })
        }
        this.isCompletedGetList = true;
    }

    // ngAfterContentChecked() {
    //     if ((this.isOpen !== this.chromeService.isDriveWindowOpen) && !(this.isOpen)) {
    //         this.isOpen = this.chromeService.isDriveWindowOpen;
    //         let that = this;
    //         this.chromeService.getFileList().then((result) => {
    //             console.log(result)
    //             that.files = result;
    //         })
    //     }
    // }
    ngAfterContentInit() {

    }
    ActiveSearch() {
        this.isActiveSearch = this.isActiveSearch === false ? true : false;
    }

    closeWindow() {
        $('#driveWindow').modal('close');
    }
    insertFileContent(file) {
        Materialize.toast("불러오기 중", 1500);
        this.chromeService.getFileContent(file)
            .then(result => {
                Materialize.toast("불러오기 성공!", 1000);
                this.renderer.selectRootElement(this.editorElement.nativeElement).insertAdjacentHTML('beforeend', result);
                $('#driveWindow').modal('close');
            })
            .catch(() => {
            })
    }

    // 에디터에 있는 내용으로 파일 생성해보기 
    createFile() {

        let requestBody = {
            name: this.newFileName,
        }
        //https://developers.google.com/drive/v3/reference/files/create 참고 
        // var contentBlob = new Blob([this.contentOnEditor], {
        //     type: 'text/html',
        // });
        this.saveProcessState = "disabled";

        this.chromeService.createFileWithMetaData(requestBody).then((createdFileMetaData) => {
            // this.renderer.selectRootElement(this.editorElement.nativeElement).insertAdjacentHTML('beforeend', "새 파일");
            this.chromeService.saveContent(createdFileMetaData.id, this.editorElement.nativeElement.innerHTML)
                .then(() => {
                    this.saveProcessState = "";
                    Materialize.toast("저장 성공!", 2000);
                    $('#driveWindow').modal('close');

                })
                .catch((e) => {
                    console.log(e);
                    Materialize.toast("메타데이터 저장성공 파일내용 저장실패", 3000);
                    this.saveProcessState = "";
                })
        }).catch((e) => {
            console.log(e);
            Materialize.toast("저장 실패", 3000);
            this.saveProcessState = "";

        })
    }
    clickNewTab() {
        this.isSelectedTab = 1;
        this.isNewFileSelected = "blue-grey "
        this.isExistingFileSelected = "blue-grey lighten-4"
    }
    clickExistTab() {
        this.isSelectedTab = 2;
        this.isExistingFileSelected = "blue-grey "
        this.isNewFileSelected = "blue-grey lighten-4"

        let that = this;
        this.chromeService.getFileList().then((result) => {
            that.files = result;
            that.isCompletedGetList = true;
        })

    }
    fileIconSource(fileMimeType) {

    }

}