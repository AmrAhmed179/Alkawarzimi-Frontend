import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AIToolInfo, Agents } from 'src/app/Models/Ai-Agent/toolInfo';

@Component({
  selector: 'vex-menu-add',
  templateUrl: './menu-add.component.html',
  styleUrls: ['./menu-add.component.scss']
})
export class MenuAddComponent implements OnInit {

  form: FormGroup;
  nodes: any[];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MenuAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { lang:string}
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.form = this.fb.group({
      entityText: ['', [Validators.required]],
      stemmedEntity: ['', [Validators.required]],
      iconSrc: ['', [Validators.required]]
    });
  }

  createModel() {
    const newModel = {
      entityText: this.form.get('entityText').value,
      stemmedEntity: this.form.get('stemmedEntity').value,
      iconSrc: this.form.get('iconSrc').value,
      children: [] // new nodes don't have children initially
    };
    this.dialogRef.close(newModel);
  }



}
