import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AutocompleteSelectValidator } from 'src/app/shared/validators/autocomplete-select-validator';

@Component({
  selector: 'vex-entities-create',
  templateUrl: './entities-create.component.html',
  styleUrls: ['./entities-create.component.scss']
})
export class EntitiesCreateComponent implements OnInit {

  form: FormGroup;
  chatBotId: number;

  constructor(@Inject(DIALOG_DATA) public data: { entityName: string[], chatBotId: number },
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<any, any>) { }

  ngOnInit(): void {
    if (this.data) {
      this.chatBotId = this.data.chatBotId;
      this.InitializeForm();
    }
  }

  InitializeForm(): void {
    debugger
    this.form = this.fb.group({
      entity: ['', [Validators.required, AutocompleteSelectValidator.compareUnMatching(this.data.entityName, true)]],
    });
  }

  CreateModel() {
    const result = {
      entity: this.form.get('entity').value,
    };
    this.dialogRef.close(result);
  }


}