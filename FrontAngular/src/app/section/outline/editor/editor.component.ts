import { EditorModule } from './editor.module';
import { Component, ElementRef, OnInit, Renderer, Input } from '@angular/core';
// import * as MediumEditorTable1 from 'medium-editor-tables';
// import * as UsingEditor from 'medium-editor';
//head에 선언된 medium_editor 자바스크립트를 역참조한다.
declare var MediumEditor: any
declare var MediumEditorTable: any;


@Component({
    moduleId: 'EditorModule',
    selector: 'editor',
    templateUrl: 'editor.component.html',
    styleUrls: ['editor.component.css']
})

// 에디터 컴포넌트 부분으로 역참조한 에디터변수를 가져와서 실제 컴포넌트의 태그에 적용을 시킨다.
export class EditorComponent implements OnInit {


    //파이프 공부해서 파이프 작성해보도록 한다. 

    private isInit: boolean = false;

    @Input() pageContent : string;

    @Input() routeData: string;
    constructor(public el: ElementRef, public renderer: Renderer) {
        //  에디터 생성!!
        // @types 에 타입을 지정해준다. 다만 사용법이 다 달라서 해당 내부를 뜯어봐야 어떻게 가져다 쓸지 보인다.

        new MediumEditor(this.renderer.selectRootElement(this.el.nativeElement), this.editorOptions);

        



        // 에디터에 대한 커스텀 이벤트 리스너 추가 
        this.el.nativeElement.addEventListener('drop', ($event: DragEvent) => {
            $event.preventDefault();
            var data = $event.dataTransfer.getData
        })
        
    }
    editorOptions: MediumEditor.CoreOptions = {
        activeButtonClass: 'medium-editor-button-active',
        buttonLabels: 'fontawesome',
        // 에디터 사용유무
        disableEditing: false,
        // 툴바 옵션
        toolbar: {
            /* These are the default options for the toolbar,
               if nothing is passed this is what is used */
            allowMultiParagraphSelection: true,
            // 버튼 옵션
            buttons: [
                `{
                    name: 'h3',
                    action: 'append-h2',
                    aria: 'header type 1',
                    tagNames: ['h2'],
                    contentDefault: '<b>H1</b>', // 툴바에 나타나는 이름
                    classList: ['custom-class-h1'],
                    attrs: {
                        'data-custom-attr': 'attr-value-h1'
                    }
                }`,
                'bold', // 굵게
                'italic', //이태릭
                'underline', //밑줄
                // 'anchor', // 링크보다도 걍 툴팁만들어준다고 보는게 맘편함,
                'fontsize',
                // 'h1',
                // 'h2',
                // 'h3',
                // 'h4',
                // 'h5',
                // 'h6',
                'table',
                'quote', // 인용구
                'strikethrough', //취소선
                'subscript',  // 아래쪽에 조그맣게
                'superscript', //  위쪽에 조그맣게
                // 'image', // 해당 블록을 이미지의 src주소에 넣어버림.
                // 'pre', // <P>를 <pre>로 바꾸어줌,
                'orderedlist', //<ol>
                'unorderedlist', //<ul>
                // 'indent', // 오른쪽 탭기능이라고 보면됨
                // 'outdent', // 반대쪽으로 가게함.
                'justifyLeft', // 왼쪽 정렬
                'justifyCenter', // 가운데 정렬
                'justifyRight', // 오른족 정렬
                'justifyFull', // 풀정렬
                // 'removeFormat', //모든 포맷을 풀어버림.
                //필요하다면 객체 형식으로 커스텀 버튼 만들어 낼 수 있음. 
            ],

            diffLeft: 50,
            diffTop: -20,
            firstButtonClass: 'medium-editor-button-first',
            lastButtonClass: 'medium-editor-button-last',
            relativeContainer: null,
            standardizeSelectionStart: true,
            static: false,
            /* options which only apply when static is true */
            align: 'center',
            sticky: false,
            updateOnEmptySelection: true
        },
        extensions: {
            'table': new MediumEditorTable({
                rows: 12,
                columns: 12
            })
        },
        placeholder: {
            /* This example includes the default options for placeholder,
               if nothing is passed this is what it used */
            text: '',
            hideOnClick: true
        },
        paste: {
            /* This example includes the default options for paste,
               if nothing is passed this is what it used */
            forcePlainText: true,
            cleanPastedHTML: true,
            cleanReplacements: [],
            cleanAttrs: ['class', 'style','href', 'dir'],
            cleanTags: ['meta','a'],
            unwrapTags: []
        },
        keyboardCommands: {
            /* This example includes the default options for keyboardCommands,
               if nothing is passed this is what it used */
            commands: [
                {
                    command: 'bold',
                    key: 'B',
                    meta: true,
                    shift: false,
                    alt: false
                },
                {
                    command: 'italic',
                    key: 'I',
                    meta: true,
                    shift: false,
                    alt: false
                },
                {
                    command: 'underline',
                    key: 'U',
                    meta: true,
                    shift: false,
                    alt: false
                }
            ],
        }


    }




    ngAfterViewInit() {

    }
    ngOnInit() { }
    ngOnChanges() {
        // 이 메소드를 쓰면 무엇이든지 붙일 수가 있다.
        // 아웃라인 컴포넌트에서 미리 새니티제이션을 마친 스트링을 이너 html로 넣어줄수도 있다. 하지만 정말 html만 들어갈뿐더러 이미지 리소스같은건 건드릴수 없음 
        // 새니티제이션을 패스시키려면 각 태그를 분석한 후에 각각 맞는 새니티제이션을 해주어야 함. 
        this.renderer.selectRootElement(this.el.nativeElement).insertAdjacentHTML('beforeend', this.routeData);

        // this.renderer.selectRootElement(this.el.nativeElement).insertAdjacentHTML('beforeend', this.pageContent);
    }
}
