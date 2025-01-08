import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { EntityModel } from 'src/app/Models/ontology-model/EntityCatogeryModel';
import { OntologyEntitiesService } from 'src/app/Services/Knowlege/ontology-entities.service';
import { DataService } from 'src/app/core/services/data.service';
import { NotifyService } from 'src/app/core/services/notify.service';

@Component({
  selector: 'vex-select-fact-category',
  templateUrl: './select-fact-category.component.html',
  styleUrls: ['./select-fact-category.component.scss']
})
export class SelectFactCategoryComponent implements OnInit {

  form:FormGroup
  constructor( private _ontologyEntitiesService:OntologyEntitiesService,
    private route: ActivatedRoute,
    private _dataService: DataService,
    private fb:FormBuilder,
    private notify: NotifyService,
    @Inject(DIALOG_DATA) public data: {category:any,entity:EntityModel, projectId:any},
   public dialogRef: MatDialogRef<SelectFactCategoryComponent>) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      categoryId:[this.data.entity.categoryId, Validators.required]
    })
  }
  save(){
    this._ontologyEntitiesService.SetCategory(this.form.controls['categoryId'].value, this.data.entity._id,this.data.projectId).subscribe((res:any)=>{
      if(res.status == 1){
        this.dialogRef.close({categoryId:this.form.controls['categoryId'].value,entityId:this.data.entity._id})
      }
    })
  }

  closeDialog(){
    this.dialogRef.close()
  }
}
