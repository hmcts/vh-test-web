import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AdalGuard, AdalInterceptor, AdalService } from 'adal-angular4';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateHearingComponent } from './create-hearing/create-hearing.component';
import { SecurityModule } from './security/security.module';
import { ConfigService } from './services/api/config.service';
import { API_BASE_URL } from './services/clients/api-client';
import { Logger } from './services/logging/logger-base';
import { LoggerService, LOG_ADAPTER } from './services/logging/logger.service';
import { AppInsightsLoggerService } from './services/logging/loggers/app-insights-logger.service';
import { ConsoleLogger } from './services/logging/loggers/console-logger';
import { SharedModule } from './shared/shared.module';

export function getSettings(configService: ConfigService) {
  return () => {
    console.log('getting config');
    configService.loadConfig();
  };
}

@NgModule({
  declarations: [
    AppComponent,
    CreateHearingComponent
  ],
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
    ConfigService
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
