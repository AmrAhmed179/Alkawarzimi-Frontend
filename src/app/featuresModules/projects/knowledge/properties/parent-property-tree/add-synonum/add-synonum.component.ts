import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AddclassAsvalueComponent } from '../../../ontology-entities/parent-ontology-entities/ontology-entities/edit-frame/parent-edit-frame/selected-entity-frame/addclass-asvalue/addclass-asvalue.component';

@Component({
  selector: 'vex-add-synonum',
  templateUrl: './add-synonum.component.html',
  styleUrls: ['./add-synonum.component.scss']
})
export class AddSynonumComponent implements OnInit {

  constructor(  @Inject(DIALOG_DATA) public data: {},
  public dialogRef: MatDialogRef<AddclassAsvalueComponent>) { }
  synonum:string
  ngOnInit(): void {
  }
  addSyn(){
    this.dialogRef.close(this.synonum)
  }
}
