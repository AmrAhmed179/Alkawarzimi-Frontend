import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ServicesSetService } from 'src/app/Services/Build/services-set.service';
import { AutocompleteSelectValidator } from 'src/app/shared/validators/autocomplete-select-validator';

@Component({
  selector: 'vex-menus-create',
  templateUrl: './menus-create.component.html',
  styleUrls: ['./menus-create.component.scss']
})
export class MenusCreateComponent implements OnInit {

  form: FormGroup;
  chatBotId: string;
  selectedServiceId: string;
  enableSelection: boolean = false;

  constructor(@Inject(DIALOG_DATA) public data: { chatBotId: string, serviceInfo: any },
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<any, any>,
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.chatBotId = this.data.chatBotId;
      this.InitializeForm();
    }
  }

  InitializeForm(): void {
    this.form = this.fb.group({
      menu: ['', [Validators.required]],
      menuType: [0, [Validators.required]]
    });
  }


  onServiceSelectionChange(selectedService: any): void {

    if (selectedService && selectedService.id) {
      this.selectedServiceId = selectedService.id;
    }
  }

  enableSelectionChange(): boolean {
    const menuTypeControl = this.form.get('menuType');
    return menuTypeControl.value !== '1';
  }


  CreateModel() {
    const result = {
      menu: this.form.get('menu').value,
      type: this.form.get('menuType').value,
      serviceId: this.selectedServiceId ? this.selectedServiceId : null,
    };
    this.dialogRef.close(result);

  }


}



