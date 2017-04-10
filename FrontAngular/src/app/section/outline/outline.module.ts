import { InnerDeviderComponent, OutlineDeviderComponent } from './outline-devider.component';
import { DriveWindowComponent } from './tab/editorTab/save/drive-window.component';
import { LinkSenderService } from '../../shared/link-sender.service';
import { SanitizeHtmlPipe } from '../../shared/sanitizeHtml.pipe';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from '../../shared/shared.module';
import { TabModule } from './tab/tab.module';
import { linkFrameModule } from './linkFrame/linkFrame.module';
import { EditorModule } from './editor/editor.module';
import { OutlineComponent } from './outline.component';
import { NgModule } from '@angular/core';
import { DragulaModule } from 'ng2-dragula/ng2-dragula';

@NgModule({
    imports: [EditorModule, SharedModule, linkFrameModule, DragulaModule, TabModule, BrowserModule],
    exports: [],
    declarations: [OutlineComponent,DriveWindowComponent,OutlineDeviderComponent,InnerDeviderComponent],
    providers: [LinkSenderService],
})
export class OutlineModule { }
