import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdalService } from 'adal-angular4';
import { Role } from './common/models/data/role';
import { ConfigService } from './services/api/config.service';
import { ProfileService } from './services/api/profile-service';
import { ErrorService } from './services/error.service';
import { LocationService } from './services/location.service';
import { Logger } from './services/logging/logger-base';
import { PageUrls } from './shared/page-url.constants';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    private readonly loggerPrefix = '[App] -';
    loggedIn: boolean;
    private isTester: boolean;

    private config = {
        tenant: '',
        clientId: '',
        redirectUri: '',
        postLogoutRedirectUri: '',
        cacheLocation: ''
    };

    constructor(
        private adalService: AdalService,
        configService: ConfigService,
        private router: Router,
        private locationService: LocationService,
        private errorService: ErrorService,
        private logger: Logger,
        private profileService: ProfileService
    ) {
        this.loggedIn = false;
        this.isTester = false;
        this.config.tenant = configService.clientSettings.tenant_id;
        this.config.clientId = configService.clientSettings.client_id;
        this.config.postLogoutRedirectUri = configService.clientSettings.post_logout_redirect_uri;
        this.config.redirectUri = configService.clientSettings.redirect_uri;
        this.config.cacheLocation = 'sessionStorage';
        this.adalService.init(this.config);
    }

    ngOnInit() {
        this.logger.debug(`${this.loggerPrefix} Starting app. Checking Auth`);
        this.checkAuth();
    }

    async checkAuth(): Promise<void> {
        const currentUrl = this.locationService.getCurrentUrl();
        if (this.locationService.getCurrentPathName() !== `/${PageUrls.Logout}`) {
            this.adalService.handleWindowCallback();
            this.loggedIn = await this.adalService.userInfo.authenticated;
            if (!this.loggedIn) {
                this.router.navigate([`/${PageUrls.Login}`], { queryParams: { returnUrl: currentUrl } });
                return;
            }
            await this.retrieveProfileRole();
        }
    }

    async retrieveProfileRole(): Promise<void> {
        console.log('Retrieving Profile');
        try {
            const profile = await this.profileService.getUserProfile();
            console.log(`Profile username is ${profile.username} role is ${profile.role}`);
            if (profile.role === Role.VHQA) {
                this.isTester = true;
            }
        } catch (error) {
            this.isTester = false;
            this.errorService.goToUnauthorised();
        }
    }

    logOut() {
        this.loggedIn = false;
        sessionStorage.clear();
        this.adalService.logOut();
    }
}
