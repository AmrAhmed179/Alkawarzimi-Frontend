import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, map, startWith } from 'rxjs';
import { ServicesSetService } from 'src/app/Services/Build/services-set.service';
import { Entities } from 'src/app/core/models/Entities';
import { OutputMapping, ServiceData, ServiceMessage, ServicesModel } from 'src/app/core/models/Services';
import { ContextVariableModel } from 'src/app/core/models/contextVariable';
import { AutocompleteSelectValidator } from 'src/app/shared/validators/autocomplete-select-validator';

@Component({
  selector: 'vex-services-create',
  templateUrl: './services-create.component.html',
  styleUrls: ['./services-create.component.scss']
})
export class ServicesCreateComponent implements OnInit {


  form: FormGroup
  chatBotId: number;

  _outputMapping: OutputMapping[] = [];
  _messages: ServiceMessage[] = [{ confirmation: '', refuseMessage: '', uncompletedObjects: '', language: 'ar' }];
  _serviceData: ServiceData[] = [];

  constructor(private fb: FormBuilder,
    private _services: ServicesSetService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(DIALOG_DATA) public data: { servicesName: string[], chatBotId: number },
    private dialogRef: MatDialogRef<ServicesCreateComponent>,) { }

  ngOnInit(): void {
    if (this.data) {
      this.chatBotId = this.data.chatBotId
      this.IntializForm()
    }
  }

  IntializForm() {
    this.form = this.fb.group({
      name: ['', [Validators.required, AutocompleteSelectValidator.compareUnMatching(this.data.servicesName, true)]],
      url: ['', [Validators.required]],
      userName: [''],
      password: [''],
      login: [false],
      mainApi: [false],
      dynamicMenuLoader: [false],
      uncompletedObjects: [''],
      messages: this.fb.array(this._messages?.map(x => this.fb.group({
        confirmation: this.fb.control(x.confirmation),
        refuseMessage: this.fb.control(x.refuseMessage),
        uncompletedObjects: this.fb.control(x.uncompletedObjects),
        language: this.fb.control(x.language)
      }))),
      serviceData: this.fb.array(this._serviceData?.map(x => this.fb.group({
        ObjectID: this.fb.control(x.ObjectID),
        Required: this.fb.control(x.Required),
        Knowledege: this.fb.control({ value: x.Knowledege, disabled: true }),
        dispaly: this.fb.control(x.dispaly),
        resetAfterUsage: this.fb.control(x.resetAfterUsage)

      }))),
      outputMapping: this.fb.array(this._outputMapping.map(a => this.fb.group({
        variableId: this.fb.control(a.variableId),
        jsonField: ({ value: a.jsonField, disabled: true })
      })))
    })

  }


  Save() {
    const model: ServicesModel = this.form.value;
    this.dialogRef.close(model)
  }



}
