import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { DeleteModel } from '../common/models/delete-model';
import { DeletedResponse } from '../services/clients/api-client';
import { Logger } from '../services/logging/logger-base';
import { TestApiService } from '../services/test-api-service';

@Component({
    selector: 'app-delete-hearing',
    templateUrl: './delete-hearing.component.html',
    styleUrls: ['./delete-hearing.component.css']
})
export class DeleteHearingComponent implements OnInit, OnDestroy {
    private deleteModel: DeleteModel;
    private deleteResponse: DeletedResponse;
    private readonly loggerPrefix: string = '[Delete Hearing(s)] -';
    form: FormGroup;
    caseNameTextfield: FormControl;
    resultsTextarea: FormControl;
    buttonAction = 'Delete';
    private defaultCaseName = '';
    resultsOutput = '';
    deleting = false;
    disableDeleteButton = true;

    constructor(
        private fb: FormBuilder,
        private logger: Logger,
        private testApiService: TestApiService,
        private spinnerService: NgxSpinnerService
    ) {}

    ngOnInit(): void {
        this.spinnerService.hide();
        this.initForm();
    }

    ngOnDestroy(): void {}

    private initForm() {
        this.caseNameTextfield = new FormControl(this.defaultCaseName);
        this.resultsTextarea = new FormControl();

        this.form = this.fb.group({
            caseNameTextfield: this.caseNameTextfield,
            resultsTextarea: this.resultsTextarea
        });
    }

    async deleteHearings() {
        this.logger.debug(`${this.loggerPrefix} Deleting hearings with case name '${this.caseName.value}'`);
        this.spinnerService.show();
        this.deleting = true;
        this.createDeleteModel();
        await this.sendDeleteRequest();
        this.outputResults();
        this.spinnerService.hide();
        this.logger.debug(`${this.loggerPrefix} Deleted hearings with case name '${this.caseName.value}'`);
        this.deleting = false;
    }

    private createDeleteModel() {
        this.deleteModel = new DeleteModel();
        this.deleteModel.case_name = this.caseName.value;
    }

    private async sendDeleteRequest() {
        this.logger.debug(`${this.loggerPrefix} SENDING HEARING REQUEST`);
        try {
            this.deleteResponse = await this.testApiService.deleteHearings(this.deleteModel);
            this.logger.debug(`${this.loggerPrefix} HEARINGS DELETED.`);
            this.logger.debug(`${this.loggerPrefix} Delete Response  ${this.deleteResponse}.`, { payload: this.deleteResponse });
        } catch (error) {
            this.logger.error(`${this.loggerPrefix} Failed to delete hearings.`, error, { payload: this.deleteResponse });
            this.spinnerService.hide();
        }
    }

    private outputResults() {
        if (this.deleteResponse.number_of_deleted_hearings != null && this.deleteResponse.number_of_deleted_hearings === 0) {
            this.resultsOutput = `No matching hearings could be found with case name '${this.caseName.value}'.`;
        } else {
            this.resultsOutput = `${this.deleteResponse.number_of_deleted_hearings} hearing(s) deleted matching case name '${this.caseName.value}'.`;
        }
    }

    get caseName() {
        return this.form.get('caseNameTextfield');
    }

    get caseNameInvalid() {
        return this.caseName.invalid && (this.caseName.dirty || this.caseName.touched);
    }

    get caseNameNotContainingTest() {
        const text = this.caseName.value.toString();
        const result = !text.toLowerCase().includes('test');
        if (result) {
            this.disableDeleteButton = true;
        } else {
            this.disableDeleteButton = false;
        }
        return result;
    }

    caseNameOnBlur() {
        const text = this.SanitizeInputText(this.caseName.value);
        this.caseName.setValue(text);
    }

    private SanitizeInputText(inputValue: string): string {
        const pattern = /(&nbsp;|<([^>]+)>)/gi;
        return inputValue ? inputValue.replace(pattern, '') : null;
    }
}
