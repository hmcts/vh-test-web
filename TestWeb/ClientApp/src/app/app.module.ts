import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AdalGuard, AdalInterceptor, AdalService } from 'adal-angular4';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateHearingComponent } from './create-hearing/create-hearing.component';
import { SecurityModule } from './security/security.module';
import { ConfigService } from './services/api/config.service';
import { API_BASE_URL } from './services/clients/api-client';
import { Logger } from './services/logging/logger-base';
import { LoggerService, LOG_ADAPTER } from './services/logging/logger.service';
import { ConsoleLogger } from './services/logging/loggers/console-logger';
import { PageTrackerService } from './services/page-tracker.service';
import { SharedModule } from './shared/shared.module';
import { DatePipe } from '@angular/common';

export function getSettings(configService: ConfigService) {
    return () => {
        configService.loadConfig();
    };
}

@NgModule({
    declarations: [AppComponent, CreateHearingComponent],
    imports: [
        BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
        HttpClientModule,
        FormsModule,
        SharedModule,
        SecurityModule,
        AppRoutingModule
    ],
    providers: [
        { provide: APP_INITIALIZER, useFactory: getSettings, deps: [ConfigService], multi: true },
        { provide: Logger, useClass: LoggerService },
        { provide: LOG_ADAPTER, useClass: ConsoleLogger, multi: true },
        // { provide: LOG_ADAPTER, useClass: AppInsightsLoggerService, multi: true, deps: [ConfigService, Router, AdalService] },
        { provide: API_BASE_URL, useFactory: () => '.' },
        AdalService,
        AdalGuard,
        { provide: HTTP_INTERCEPTORS, useClass: AdalInterceptor, multi: true },
        ConfigService,
        DatePipe,
        PageTrackerService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
