import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { EntityModel } from 'src/app/Models/ontology-model/EntityCatogeryModel';
import { OntologyEntitiesService } from 'src/app/Services/Knowlege/ontology-entities.service';
import { OptionsServiceService } from 'src/app/Services/options-service.service';
import { DataService } from 'src/app/core/services/data.service';
import { NotifyService } from 'src/app/core/services/notify.service';

@Component({
  selector: 'vex-addclass-asvalue',
  templateUrl: './addclass-asvalue.component.html',
  styleUrls: ['./addclass-asvalue.component.scss']
})
export class AddclassAsvalueComponent implements OnInit {
  search:string = ''
  entityTypeValue:string = 'all'
  lang:string
  currentClassAndPrpsIndex:number
  classesAndPropsFilter:EntityModel[]
  classesAndProps:EntityModel[]
  constructor(private route: ActivatedRoute,
    private _ontologyEntitiesService:OntologyEntitiesService,
    private _dataService: DataService,
    private fb:FormBuilder,
    private notify: NotifyService,
    public dialog: MatDialog,
    private router: Router,
    private _optionsService:OptionsServiceService,
    @Inject(DIALOG_DATA) public data: {entities:EntityModel[] },
    public dialogRef: MatDialogRef<AddclassAsvalueComponent>

  ) { }

  ngOnInit(): void {
    this.classesAndProps = this.data.entities
  }

  formChang(){
    debugger
    var entityTypeValue = this.entityTypeValue
    var search = this.search


    if(search.trim() != ''){
      if(entityTypeValue == 'all'){
        this.classesAndProps = this.data.entities.filter(x=>x.entityInfo[0].entityText.trim().includes(search.trim()))
        this.currentClassAndPrpsIndex = 0
      }
      else{
        this.classesAndProps = this.data.entities.filter(x=>x.entityInfo[0].entityText.trim().includes(search.trim()) && x.entityType ==entityTypeValue)
        this.currentClassAndPrpsIndex = 0
      }
    }
    else{
      if(entityTypeValue =='all'){
         this.classesAndProps =  this.data.entities
         this.currentClassAndPrpsIndex = 0
      }
      else{
        this.classesAndProps = this.data.entities.filter(x=> x.entityType ==entityTypeValue)
        this.currentClassAndPrpsIndex = 0
      }
    }

  }
  clickOnList(entity:EntityModel, index){
    this.currentClassAndPrpsIndex = index
  }

  addClass(){
    debugger
    this.dialogRef.close('')
    if(this.currentClassAndPrpsIndex){
      let entity = this.classesAndProps[this.currentClassAndPrpsIndex]
      this.dialogRef.close(entity._id)
    }
  }
}
