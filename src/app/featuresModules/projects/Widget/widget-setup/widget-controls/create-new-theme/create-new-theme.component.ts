import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'vex-create-new-theme',
  templateUrl: './create-new-theme.component.html',
  styleUrls: ['./create-new-theme.component.scss']
})
export class CreateNewThemeComponent implements OnInit {
  themeForm: UntypedFormGroup;
  constructor(
    private fb: UntypedFormBuilder,
    private dialogRef: MatDialogRef<CreateNewThemeComponent>
  ) {}
  ngOnInit() {
    this.themeForm = this.fb.group({
      themeName: ["", [Validators.required]],
    });
  }
  onSubmit() {
    this.createNewTheme();
  }
  createNewTheme() {
    this.dialogRef.close(this.themeForm.value.themeName);
  }
  close() {
    this.dialogRef.close();
  }
}


