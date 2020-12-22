import { Injectable } from "@angular/core";
import { Summary } from "./models/summary";

@Injectable({
  providedIn: 'root'
})
export class SummeriesService {

  private summaries: Summary[];

  constructor() {
      this.summaries = [];
  }

  getSummaries(){
    return this.summaries;
  }

  setSummaries(summeries: Summary[]){
    this.summaries = summeries;
  }

  resetSummaries(){
    this.summaries = [];
  }
}
