import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard';
import { Logger } from 'src/app/services/logging/logger-base';
import { Summary } from 'src/app/services/test-api/models/summary';
import { SummeriesService } from 'src/app/services/test-api/summeries-service';
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
    summeries: Summary[];

    constructor(
        protected router: Router,
        protected logger: Logger,
        private clipboardService: ClipboardService,
        summeriesService: SummeriesService
    ) {
        super(router, logger);
        this.summeries = summeriesService.getSummaries();
    }

    ngOnInit(): void {
        this.redirectIfNoData();
        this.resetTooltipText();
    }

    private redirectIfNoData() {
        if (this.summeries.length === 0) {
            this.router.navigate([PageUrls.CreateHearings]);
        }
    }

    clickCreateHearings() {
        this.router.navigate([PageUrls.CreateHearings]);
    }

    copyHearing(hearingNumber: number) {
        const summary = this.summeries[hearingNumber].toText();
        this.clipboardService.copyFromContent(summary);
        this.tooltip = 'Conference details copied to clipboard';
        this.logger.debug(`${this.loggerPrefix} Copied conference details to clipboard.`, { Summary: summary });
    }

    resetTooltipText() {
        this.tooltip = 'Copy conference details to clipboard';
    }

    theLastEntry(totalEntries: number, index: number) {
        if (totalEntries === index + 1) {
            return true;
        }
        return false;
    }
}
