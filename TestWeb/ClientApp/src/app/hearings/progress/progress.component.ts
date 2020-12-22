import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Logger } from 'src/app/services/logging/logger-base';
import { CreateService } from 'src/app/services/test-api/create-service';
import { Summary } from 'src/app/services/test-api/models/summary';
import { SummeriesService } from 'src/app/services/test-api/summeries-service';
import { PageUrls } from 'src/app/shared/page-url.constants';
import { HearingBaseComponentDirective } from '../hearing-base/hearing-base-component';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css']
})
export class ProgressComponent extends HearingBaseComponentDirective implements OnInit {

  enableContinueButton = false;
  enableRetryButton = false;
  errors = [];
  caseNames = [];
  summeries: Summary[];

  constructor(
    protected router: Router,
    protected createService: CreateService,
    protected logger: Logger,
    private spinnerService: NgxSpinnerService,
    summeriesService: SummeriesService
  ) {
    super(router, logger);
    this.summeries = summeriesService.getSummaries();
  }

  async ngOnInit(): Promise<void> {
    this.spinnerService.show();
    try {
      this.summeries = await this.createService.createHearings();
      for (const summary of this.summeries) {
        var casename = summary.getCaseName();
        this.caseNames.push(casename);
      }
      this.enableContinueButton = true;
    } catch (error) {
      this.logger.error(`${this.loggerPrefix} Failed to create hearings.`, error);
      this.errors.push(error);
      this.enableRetryButton = true;
    }
    this.spinnerService.hide();
  }

  continue(){
    this.router.navigate([PageUrls.Summary]);
  }

  goBackToHearings(){
    this.router.navigate([PageUrls.CreateHearings]);
  }

  summeriesToDisplay(): boolean {
    this.logger.debug(`${this.loggerPrefix} Summeries length is ${this.summeries.length}`);
    if(this.summeries.length > 0){
      return true;
    };
    return false;
  }

  errorsToDisplay(): boolean {
    this.logger.debug(`${this.loggerPrefix} Errors length is ${this.errors.length}`);
    if(this.errors.length > 0){
      return true;
    };
    return false;
  }
}
