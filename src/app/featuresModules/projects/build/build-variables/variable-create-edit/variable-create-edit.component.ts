import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, map, startWith } from 'rxjs';
import { ContextVariableModel, DataTypes } from 'src/app/core/models/contextVariable';
import { AutocompleteSelectValidator } from 'src/app/shared/validators/autocomplete-select-validator';

@Component({
  selector: 'vex-variable-create-edit',
  templateUrl: './variable-create-edit.component.html',
  styleUrls: ['./variable-create-edit.component.scss']
})
export class VariableCreateEditComponent implements OnInit {

  form: FormGroup
  filteredDataTypes: Observable<DataTypes[]>;
  contextVariableType: string = "";
  constructor(
    @Inject(DIALOG_DATA) public data: { dataTypes: DataTypes[], variable: ContextVariableModel, mode: string, listName: string[], sysVariable: boolean },
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<VariableCreateEditComponent>
  ) { }

  ngOnInit(): void {

    if (this.data) {
      const ListDataTypes = this.data.dataTypes.map(x => x.type)

      if (this.data.mode === 'edit') {
        this.data.listName.splice(this.data.listName.indexOf(this.data.variable.key), 1)
        let type = this.data.sysVariable == true ? this.data.variable.type : this.data.dataTypes.find(a => a.id == this.data.variable.type).type;
        this.form = this.fb.group({
          key: [this.data.variable.key, [Validators.required, AutocompleteSelectValidator.compareUnMatching(this.data.listName, false)]],
          name: [this.data.variable.name],
          value: [this.data.variable.value],
          type: [type, [Validators.required]],
          list: [this.data.variable.list],
          validationSubType: [this.data.variable.validationSubType]

        })
      }
      else {
        this.form = this.fb.group({
          key: ['', [Validators.required, AutocompleteSelectValidator.compareUnMatching(this.data.listName, true)]],
          name: [''],
          value: [''],
          type: ['', [Validators.required]],
          list: [false],
          validationSubType: ['0']
        })
      }

      this.filteredDataTypes = this.form.get("type").valueChanges.pipe(
        startWith(''),
        map(value => {
          this.contextVariableType = this.form.get("type").value;
          this.form.get("type").addValidators(AutocompleteSelectValidator.compareMatching(ListDataTypes));
          return this._filter(value || '')
        }),
      );
    }
  }
  private _filter(value: string): DataTypes[] {
    const filterValue = value.toLowerCase();
    return this.data.dataTypes.filter(option => option.type.toLowerCase().includes(filterValue));
  }

  createVariable() {
    const dataType = this.data.dataTypes.find(a => a.type == this.form.value["type"]);
    let Type: string = "";
    if (dataType.dataType == "sys") {
      Type = dataType.type;
    }
    else {
      Type = dataType.id;
    }
    const v: ContextVariableModel = {
      contextVariableId: '',
      key: this.form.value["key"],
      intentId: '',
      name: this.form.value["name"],
      value: this.form.value["value"],
      type: Type,
      dataType: dataType.dataType,
      validationSubType: this.form.value["validationSubType"].toString(),
      list: this.form.value["list"],
      sysVariable: false,
      sourceBot: null,
      servicesId: null,
      sysVariabletype: 0,
      displayFields: []
    }
    this.dialogRef.close(v)
  }

  editVariable() {
    const dataType = this.data.dataTypes.find(a => a.type == this.form.value["type"]);
    let Type: string = "";
    if (dataType.dataType == "sys") {
      Type = dataType.type;
    }
    else {
      Type = dataType.id;
    }
    const v: ContextVariableModel = {
      contextVariableId: this.data.variable.contextVariableId,
      key: this.form.value["key"],
      intentId: '',
      name: this.form.value["name"],
      value: this.form.value["value"],
      type: Type,
      dataType: dataType.dataType,
      validationSubType: this.form.value["validationSubType"].toString(),
      list: this.form.value["list"],
      sysVariable: false,
      sourceBot: null,
      servicesId: null,
      sysVariabletype: 0,
      displayFields: []
    }
    this.dialogRef.close(v)
  }

}
