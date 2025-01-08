import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'vex-dialog-create-template',
  templateUrl: './dialog-create-template.component.html',
  styleUrls: ['./dialog-create-template.component.scss']
})
export class DialogCreateTemplateComponent implements OnInit {

  constructor(private fb:FormBuilder) { }

  form:FormGroup

  ngOnInit(): void {
    this.form = this.fb.group({
      TemplateType: ['',],
      NameEn: ['', ],
  })}

  createTemplate(){

  }
}
