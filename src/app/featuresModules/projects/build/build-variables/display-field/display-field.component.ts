import { ContextVariableModel } from 'src/app/core/models/contextVariable';
import { Component, OnInit, Inject } from '@angular/core';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'vex-display-field',
  templateUrl: './display-field.component.html',
  styleUrls: ['./display-field.component.scss']
})
export class DisplayFieldComponent implements OnInit {

  form: FormGroup

  constructor(
    @Inject(DIALOG_DATA) public data: { variable: ContextVariableModel },
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DisplayFieldComponent>) { }

  ngOnInit(): void {
    let listNames = [];

    if (this.data) {
      if (this.data.variable &&this.data.variable.displayFields &&this.data.variable.displayFields.length > 0) {
        listNames = this.data.variable.displayFields.map((x) => {
          return new FormControl(x, [Validators.required]);
        });
      }
      else {
        let f = new FormControl("", [Validators.required]);
        listNames.push(f);
      }
    }

    this.form = this.fb.group({
      name: this.fb.array([...listNames], [Validators.required]),
    });
  }


  addName() {
    if (this.isnameDisabled()) return;
    let item = new FormControl("", [Validators.required]);
    this.name.push(item);
  }

  get name() {
    return this.form.get("name") as FormArray;
  }
  deletename(NameAlterIndex: number) {
    this.name.removeAt(NameAlterIndex);
  }

  isnameDisabled() {
    let item =
      this.name.controls[
      this.name.length - 1
      ];
    if (!item) return false;
    if (item.value == null || item.value.length == 0) return true;
    return false;
  }

  Save(){
    debugger
    const a=this.form.value["name"]
    this.dialogRef.close(this.form.value["name"])
  }
}