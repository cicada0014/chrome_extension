import { TutorialComponent } from './tutorial.component';
import { SharedModule } from '../shared/shared.module';
import { NoTokenPageComponent } from './error-page/no-token-page.component';
import { SettingModule } from './setting/setting.module';
import { OutlineModule } from './outline/outline.module';
import { SectionRoutingModule } from './section-routing.module';
import { SectionComponent } from './section.component';
import { InvalidUrlPageComponent } from './error-page/invalid-url-page.component';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [SectionRoutingModule,OutlineModule,SettingModule,SharedModule],
    exports: [SectionComponent,InvalidUrlPageComponent,NoTokenPageComponent],
    declarations: [SectionComponent,InvalidUrlPageComponent,NoTokenPageComponent,TutorialComponent],
    providers: [],
})
export class SectionModule { }
