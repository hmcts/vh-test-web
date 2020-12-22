import { Injectable } from "@angular/core";
import { Logger } from "../logging/logger-base";
import { AllocationService } from "./allocation-service";
import { ConfirmService } from "./confirm-service";
import { HearingFormData } from "./models/hearing-form-data";
import { HearingService } from "./hearing-service";
import { ResetService } from "./reset-service";
import { Summary } from "./models/summary";

@Injectable({
  providedIn: 'root'
})
export class CreateService {

  private readonly loggerPrefix: string = '[CreateService] -';
  private hearingFormData: HearingFormData;

  constructor(
    private logger: Logger,
    private allocationService: AllocationService,
    private hearingService: HearingService,
    private confirmService: ConfirmService,
    private resetService: ResetService,
    hearingFormData: HearingFormData
    ) {
    this.hearingFormData = hearingFormData;
  }

  async createHearings(): Promise<Summary[]> {
    var summaries = [];
    for (let index = 0; index < this.hearingFormData.numberOfHearings; index++) {
      var allocatedUsers = await this.allocationService.AllocatateUsers(this.hearingFormData);
      var hearing = await this.hearingService.CreateHearing(this.hearingFormData, allocatedUsers);
      var conference = await this.confirmService.ConfirmHearing(hearing, allocatedUsers);
      var resetPasswords = await this.resetService.resetPasswords(allocatedUsers);
      summaries.push(new Summary(conference, resetPasswords));
    }
    this.logger.debug(`${this.loggerPrefix} ${summaries.length} SUMMARIES CREATED`);
    return summaries;
  }
}
