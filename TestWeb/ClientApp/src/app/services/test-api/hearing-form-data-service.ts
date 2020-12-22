import { Injectable } from "@angular/core";
import { HearingFormData } from "./models/hearing-form-data";

@Injectable({
  providedIn: 'root'
})
export class HearingFormDataService {

  private hearingFormData: HearingFormData;

  constructor() {
      this.hearingFormData = new HearingFormData();
  }

  getHearingFormData(){
    return this.hearingFormData;
  }

  setHearingFormData(hearingFormData: HearingFormData){
    this.hearingFormData = hearingFormData;
  }
}
