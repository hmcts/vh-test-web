import { Directive, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { Logger } from "src/app/services/logging/logger-base";
import { Summary } from "src/app/services/test-api/models/summary";

@Directive()
export abstract class HearingBaseComponentDirective implements OnInit {
  protected readonly loggerPrefix: string = '[Hearing] -';
  private readonly componentName: string;
  protected summeries: Summary[];

  buttonAction: string;
  editMode = false;
  form: FormGroup;

  protected constructor(
      protected router: Router,
      protected logger: Logger
  ) {
      const componentName = this.constructor.name;
      const index = componentName.indexOf('Component');
      this.componentName = componentName.substring(0, index);
      this.loggerPrefix = `${this.loggerPrefix} [${componentName}] -`;
      this.summeries = [];
  }

  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }
}
