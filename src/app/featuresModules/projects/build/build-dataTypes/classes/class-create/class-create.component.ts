import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AutocompleteSelectValidator } from 'src/app/shared/validators/autocomplete-select-validator';

@Component({
  selector: 'vex-class-create',
  templateUrl: './class-create.component.html',
  styleUrls: ['./class-create.component.scss']
})
export class ClassCreateComponent implements OnInit {


  form: FormGroup;
  chatBotId: string;

  constructor(@Inject(DIALOG_DATA) public data: { chatBotId: string, className: string[], },
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<any, any>) { }

  ngOnInit(): void {
    if (this.data) {
      this.chatBotId = this.data.chatBotId;
      this.InitializeForm();
    }
  }

  InitializeForm(): void {
    this.form = this.fb.group({
      class: ['', [Validators.required]],
    });
  }

  CreateModel() {
    debugger
    const result = {
      class: this.form.get('class').value,
    };
    this.dialogRef.close(result);
  }


}
