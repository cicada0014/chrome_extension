import { userInfo } from 'os';
import { OwnServerService } from '../../shared/own-server.service';
import { ChromeExtensionService } from '../../shared/chrome-extension.service';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/Rx';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanActivateChild,
    CanDeactivate,
    Router,
    RouterStateSnapshot
} from '@angular/router';
import { Injectable } from '@angular/core';



declare var chrome: any

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
    private isGetToken: boolean;

    constructor(private router: Router, private chromeService: ChromeExtensionService, private ownServerService: OwnServerService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {



        return this.chromeService.checkGetToken()
            .then(user_info => {

                console.log(user_info);
                this.ownServerService.getUserData(user_info.id)
                .then()
                .catch(()=>{
                    // 캐치문이 돌아간다는 것은 데이터가 없는 유저
                    // 즉 처음 방문했다는 증거이므로 이 사용자에게는 튜토리얼을 보여줄 수 있도록 한다 .
                    
                    this.ownServerService.postUserInfo(user_info);
                });
                return true
            })
            .catch(falseResult => { return falseResult });



    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return true;
    }

    checkLogin(url: string): boolean {





        return false;
    }

}
