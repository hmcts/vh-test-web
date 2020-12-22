import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard';
import { Logger } from 'src/app/services/logging/logger-base';
import { PageUrls } from 'src/app/shared/page-url.constants';
import { HearingBaseComponentDirective } from '../hearing-base/hearing-base-component';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent extends HearingBaseComponentDirective implements OnInit {

  protected readonly loggerPrefix: string = '[Summary] -';
  tooltip: string;

  constructor(
    protected router: Router,
    protected logger: Logger,
    private clipboardService: ClipboardService
  )
  {
    super(router, logger)
  }

  ngOnInit(): void {
    this.resetTooltipText();
  }

  bookAnotherHearing(){
    this.router.navigate([PageUrls.CreateHearings]);
  }

  copyHearing(hearingNumber: number) {
    const summary = this.summeries[hearingNumber].toText()
    this.clipboardService.copyFromContent(summary);
    this.tooltip = 'Conference details copied to clipboard';
    this.logger.debug(`${this.loggerPrefix} Copied conference details to clipboard.`, { Summary: summary });
  }

  resetTooltipText() {
    this.tooltip = 'Copy conference details to clipboard';
  }
}
