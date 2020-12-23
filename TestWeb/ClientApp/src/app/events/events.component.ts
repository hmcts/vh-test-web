import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { EventType } from 'src/app/services/clients/api-client';
import { Logger } from 'src/app/services/logging/logger-base';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  form: FormGroup;
  protected readonly loggerPrefix: string = '[Create Hearing(s)] -';
  caseNames: string[] = ["Please select"];
  eventTypes: string[] = [EventType.None, EventType.Close, EventType.Disconnected, EventType.Consultation, EventType.Joined, EventType.Leave, EventType.MediaPermissionDenied, EventType.ParticipantJoining,
  EventType.ParticipantNotSignedIn, EventType.Pause, EventType.SelfTestFailed, EventType.Start, EventType.Suspend, EventType.Transfer, EventType.VhoCall];
  private defaultEventType: EventType = EventType.None;
  private defaultCaseName = "Please select";
  eventTypeDropdown: FormControl;
  caseNamesDropdown: FormControl;

  constructor(
    private fb: FormBuilder,
    private logger: Logger,
    private router: Router,
    private spinnerService: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinnerService.hide();
    this.initForm();
  }

  private initForm() {
    this.caseNamesDropdown = new FormControl(this.defaultCaseName);
    this.eventTypeDropdown = new FormControl(this.defaultEventType);
    this.form = this.fb.group({
      caseNamesDropdown: this.caseNamesDropdown,
      eventTypeDropdown: [this.eventTypeDropdown, [Validators.required, Validators.pattern('^((?!Please select).)*$')]]
    });
  }

}
