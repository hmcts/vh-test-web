import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdalService } from 'adal-angular4';
import { ConfigService } from './services/api/config.service';
import { LocationService } from './services/location.service';
import { pageUrls } from './shared/page-url.constants';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    loggedIn: boolean;

    constructor(
        private adalService: AdalService,
        private configService: ConfigService,
        private router: Router,
        private locationService: LocationService
    ) {
        this.loggedIn = false;
        this.initAuthentication();
    }

    ngOnInit() {
        this.checkAuth();
    }

    private initAuthentication() {
        const clientSettings = this.configService.getClientSettings();
        const config = {
            tenant: clientSettings.tenant_id,
            clientId: clientSettings.client_id,
            postLogoutRedirectUri: clientSettings.post_logout_redirect_uri,
            redirectUri: clientSettings.redirect_uri,
            cacheLocation: 'sessionStorage'
        };
        this.adalService.init(config);
    }

    async checkAuth(): Promise<void> {
        const currentUrl = this.locationService.getCurrentUrl();
        if (this.locationService.getCurrentPathName() !== `/${pageUrls.Logout}`) {
            this.adalService.handleWindowCallback();
            this.loggedIn = this.adalService.userInfo.authenticated;
            if (!this.loggedIn) {
                this.router.navigate([`/${pageUrls.Login}`], { queryParams: { returnUrl: currentUrl } });
                return;
            }
        }
    }

    logOut() {
      this.loggedIn = false;
      sessionStorage.clear();
      this.adalService.logOut();
  }
}
