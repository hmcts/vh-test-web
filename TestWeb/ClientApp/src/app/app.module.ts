import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AdalGuard, AdalInterceptor, AdalService } from 'adal-angular4';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateHearingComponent } from './hearings/create-hearing/create-hearing.component';
import { DeleteHearingComponent } from './hearings/delete-hearing/delete-hearing.component';
import { SecurityModule } from './security/security.module';
import { ConfigService } from './services/api/config.service';
import { API_BASE_URL } from './services/clients/api-client';
import { Logger } from './services/logging/logger-base';
import { LoggerService, LOG_ADAPTER } from './services/logging/logger.service';
import { ConsoleLogger } from './services/logging/loggers/console-logger';
import { PageTrackerService } from './services/page-tracker.service';
import { SharedModule } from './shared/shared.module';
import { WindowRef } from './security/window-ref';
import { DatePipe } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Config } from './common/models/config';
import { ProgressComponent } from './hearings/progress/progress.component';
import { SummaryComponent } from './hearings/summary/summary.component';

export let ENVIRONMENT_CONFIG: Config = new Config();

export function getSettings(configService: ConfigService) {
    return async () => {
        console.log('STARTING APP INITIALISER');
        await configService.loadConfig();
        console.log('FINISHED APP INITIALISER');
    };
}

@NgModule({
    declarations: [AppComponent, CreateHearingComponent, ProgressComponent, SummaryComponent, DeleteHearingComponent],
    imports: [
        BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
        HttpClientModule,
        FormsModule,
        SharedModule,
        SecurityModule,
        AppRoutingModule,
        NgxSpinnerModule,
        BrowserAnimationsModule
    ],
    providers: [
        { provide: APP_INITIALIZER, useFactory: getSettings, deps: [ConfigService], multi: true },
        { provide: Config, useFactory: () => ENVIRONMENT_CONFIG },
        { provide: Logger, useClass: LoggerService },
        { provide: LOG_ADAPTER, useClass: ConsoleLogger, multi: true },
        { provide: API_BASE_URL, useFactory: () => '.' },
        AdalService,
        AdalGuard,
        { provide: HTTP_INTERCEPTORS, useClass: AdalInterceptor, multi: true },
        ConfigService,
        DatePipe,
        PageTrackerService,
        WindowRef
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    bootstrap: [AppComponent]
})
export class AppModule {}
