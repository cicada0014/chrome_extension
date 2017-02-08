import { OutlineModule } from '../outline/outline.module';
import { SectionRoutingModule } from './section-routing.module';
import { SectionComponent } from './section.component';
import { InvalidUrlPageComponent } from '../invalid-url-page.component';

import { NgModule } from '@angular/core';
import { DragulaModule } from 'ng2-dragula/ng2-dragula';

@NgModule({
    imports: [SectionRoutingModule,OutlineModule],
    exports: [SectionComponent],
    declarations: [SectionComponent],
    providers: [],
})
export class SectionModule { }
