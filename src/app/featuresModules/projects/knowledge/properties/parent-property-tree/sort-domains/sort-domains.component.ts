import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AddclassAsvalueComponent } from '../../../ontology-entities/parent-ontology-entities/ontology-entities/edit-frame/parent-edit-frame/selected-entity-frame/addclass-asvalue/addclass-asvalue.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'vex-sort-domains',
  templateUrl: './sort-domains.component.html',
  styleUrls: ['./sort-domains.component.scss']
})
export class SortDomainsComponent implements OnInit {

  constructor(  @Inject(DIALOG_DATA) public data: {Domains:any},
  public dialogRef: MatDialogRef<SortDomainsComponent>) { }
  synonum:string
  ngOnInit(): void {
  }
  saveDomains(){
    this.dialogRef.close(this.data.Domains)
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.data.Domains, event.previousIndex, event.currentIndex);
  }

}
