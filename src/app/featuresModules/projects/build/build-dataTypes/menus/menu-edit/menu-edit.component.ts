import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MenuNode } from '../menus-info/menus-info.component';

@Component({
  selector: 'vex-menu-edit',
  templateUrl: './menu-edit.component.html',
  styleUrls: ['./menu-edit.component.scss']
})
export class MenuEditComponent {

  node: MenuNode;

  constructor(
    private dialogRef: MatDialogRef<MenuEditComponent>,
      @Inject(MAT_DIALOG_DATA) public data: {node:MenuNode,lang:string},
    private fb: FormBuilder
  ) {
    debugger
    this.node = structuredClone(data.node)
    if(data.lang == 'en' && !this.node.nodeLangInfo.some(x=>x.language == 'en')){
      this.node.nodeLangInfo.push({ entityText: '', stemmedEntity: '', language: 'en'})
    }
     if(data.lang == 'ar' && !this.node.nodeLangInfo.some(x=>x.language == 'ar')){
      this.node.nodeLangInfo.push({ entityText: '', stemmedEntity: '', language: 'ar'})
    }
  }

  save(): void {
    this.dialogRef.close(this.node);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
