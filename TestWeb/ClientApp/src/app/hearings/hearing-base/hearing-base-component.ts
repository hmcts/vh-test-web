import { Directive, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Logger } from 'src/app/services/logging/logger-base';
import { Summary } from 'src/app/services/test-api/models/summary';

@Directive()
export abstract class HearingBaseComponentDirective implements OnInit {
    protected readonly loggerPrefix: string = '[HearingBaseComponentDirective] -';

    buttonAction: string;
    editMode = false;
    form: FormGroup;

    protected constructor(protected router: Router, protected logger: Logger) {
        const componentName = this.constructor.name;
        this.loggerPrefix = `${this.loggerPrefix} [${componentName}] -`;
    }

    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }
}
