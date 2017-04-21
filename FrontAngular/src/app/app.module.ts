import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChromeExtensionService } from './shared/chrome-extension.service';
import { NavBarService } from './shared/nav-bar.service';
import { CanDeactivateGuard } from './header/auth-guard/can-deactivate-guard.service';
import { AuthGuard } from './header/auth-guard/auth-guard.service';
import { SectionModule } from './section/section.module';
import { LoginUserService } from './user/user';
import { UserResolveService } from './user/user-resolve.service';
import { HeaderModule } from './header/header.module';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { Angular2FontAwesomeModule } from 'angular2-font-awesome/angular2-font-awesome';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    HeaderModule,
    SectionModule,
    JsonpModule,
    Angular2FontAwesomeModule,
    BrowserAnimationsModule
  ],
  providers: [AuthGuard,
    CanDeactivateGuard,
    UserResolveService,
    LoginUserService,
    NavBarService,
    ChromeExtensionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
