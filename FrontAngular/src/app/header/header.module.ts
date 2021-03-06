import { LoginBoardComponent } from './login/login-board.component';
import { LoginComponent } from './login/login.component';
import { SharedModule } from '../shared/shared.module';
import { HelpComponent } from './help/help.component';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { NgModule } from '@angular/core';



@NgModule({
    imports: [
        SharedModule,
    ],
    exports: [HeaderComponent],
    declarations: [HeaderComponent, HelpComponent,LoginComponent,LoginBoardComponent],
    providers: [],
})
export class HeaderModule { }
