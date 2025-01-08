import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

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
    private dialogRef: MatDialogRef<MenuAddComponent>
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
