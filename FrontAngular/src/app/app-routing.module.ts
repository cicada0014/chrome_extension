import { NoTokenPageComponent } from './section/error-page/no-token-page.component';
import { AuthGuard } from './header/auth-guard/auth-guard.service';
import { SettingKeymapComponent } from './section/setting/setting-keymap.component';
import { SettingComponent } from './section/setting/setting.component';
import { CanDeactivateGuard } from './header/auth-guard/can-deactivate-guard.service';
import { OutlineComponent } from './section/outline/outline.component';
import { UserResolveService } from './user/user-resolve.service';
import { SectionComponent } from './section/section.component';
import { InvalidUrlPageComponent } from './section/error-page/invalid-url-page.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './header/login/login.component';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '3ndEditor', // 제품 url 을 설명하기 위한,,
    pathMatch: 'full'
  },
  {
    path: '3ndEditor',
    // canActivate: [AuthGuard], // 로그인 검사를 하는 가드. 토큰을 얻을 수 없는 상황이라면 
    children: [
      {
        path: '',
        redirectTo: 'index',
        pathMatch: 'full'
      },
      // {
      //   path: 'setting',
      //   component: SettingComponent,
      //   children: [
      //     {
      //       path: '',
      //       redirectTo: 'keymap',
      //       pathMatch: 'full'
      //     },
      //     {
      //       path: 'keymap',
      //       component: SettingKeymapComponent
      //     }
      //   ]
      // },
      {
        path: ':loginUserName',
        component: OutlineComponent,
        // canDeactivate : [CanDeactivateGuard],
        resolve: {
          userResolveService: UserResolveService
        }
      }
    ]
  },
  {
    path: 'welcome',
    component: NoTokenPageComponent,
    pathMatch: 'full'

  },

  {
    path: '**',
    component: InvalidUrlPageComponent,
    pathMatch: 'full'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }

//export const routedComponents = [NameComponent];