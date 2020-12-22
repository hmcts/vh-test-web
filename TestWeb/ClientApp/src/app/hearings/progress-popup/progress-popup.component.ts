import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Logger } from 'src/app/services/logging/logger-base';
import { CreateService } from 'src/app/services/test-api/create-service';
import { PageUrls } from 'src/app/shared/page-url.constants';
import { HearingBaseComponentDirective } from '../hearing-base/hearing-base-component';

@Component({
  selector: 'app-progress-popup',
  templateUrl: './progress-popup.component.html',
  styleUrls: ['./progress-popup.component.css']
})
export class ProgressPopupComponent extends HearingBaseComponentDirective implements OnInit {

  enableContinueButton = false;
  errors = [];

  constructor(
    protected router: Router,
    protected createService: CreateService,
    protected logger: Logger,
    private spinnerService: NgxSpinnerService
  ) {
    super(router, logger)
  }

  async ngOnInit(): Promise<void> {
    this.spinnerService.show();
    try {
      this.summeries = await this.createService.createHearings();
    } catch (error) {
      this.logger.error(`${this.loggerPrefix} Failed to create hearings.`, error);
      this.errors.push(error);
    }
    this.spinnerService.hide();
  }

  continue(){
    this.router.navigate([PageUrls.Summary]);
  }
}
