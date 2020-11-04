import { Component, Injectable, OnInit } from '@angular/core';
import { AdalService } from 'adal-angular4';
import { pageUrls } from 'src/app/shared/page-url.constants';

@Component({
    selector: 'app-logout',
    templateUrl: './logout.component.html'
})
@Injectable()
export class LogoutComponent implements OnInit {
    readonly loginPath = `../${pageUrls.Login}`;
    constructor(private adalSvc: AdalService) {
    }

    ngOnInit() {
        if (this.adalSvc.userInfo.authenticated) {
            this.adalSvc.logOut();
        }
    }

    get loggedIn(): boolean {
        return this.adalSvc.userInfo.authenticated;
    }
}
