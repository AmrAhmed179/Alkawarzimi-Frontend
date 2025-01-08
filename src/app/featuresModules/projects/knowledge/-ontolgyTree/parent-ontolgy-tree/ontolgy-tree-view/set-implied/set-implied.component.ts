import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/core/services/data.service';
import { NotifyService } from 'src/app/core/services/notify.service';
import { EntityModel } from 'src/app/Models/ontology-model/EntityCatogeryModel';
import { OntologyEntitiesService } from 'src/app/Services/Knowlege/ontology-entities.service';
import { OptionsServiceService } from 'src/app/Services/options-service.service';

@Component({
  selector: 'vex-set-implied',
  templateUrl: './set-implied.component.html',
  styleUrls: ['./set-implied.component.scss']
})
export class SetImpliedComponent implements OnInit {

  search:string = ''
  entityTypeValue:string = 'all'
  lang:string
  currentClassAndPrpsIndex:number
  impliedEntityIndex:number
  classesAndPropsFilter:EntityModel[]
  classesAndProps:EntityModel[]
  impliedEntity:EntityModel[] = []
  constructor(private route: ActivatedRoute,
    private _ontologyEntitiesService:OntologyEntitiesService,
    private _dataService: DataService,
    private fb:FormBuilder,
    private notify: NotifyService,
    public dialog: MatDialog,
    private router: Router,
    private _optionsService:OptionsServiceService,
    @Inject(DIALOG_DATA) public data: {entities:EntityModel[] , impliedEntity:EntityModel[]},
    public dialogRef: MatDialogRef<SetImpliedComponent>
  ) { }

  ngOnInit(): void {
    this.classesAndProps = this.data.entities.filter(x=>x.entityType == "action")
    this.impliedEntity = this.data.impliedEntity
  }
  formChang(){
    var search = this.search
    this.classesAndProps = this.data.entities.filter(x=>x.entityInfo[0].entityText.trim().includes(search.trim()) && x.entityType == "action")
  }

  clickOnList(entity:EntityModel, index){
    this.currentClassAndPrpsIndex = index
  }

  setImlied(){
    debugger
    let entity = this.classesAndProps[this.currentClassAndPrpsIndex]
    if(entity)
      this.dialogRef.close(entity._id)
    else{
      this.dialogRef.close(-1)
    }
  }
  deleteImplied(){
    this.impliedEntity.splice(0,1)
  }

  addFrame(){
    if(this.impliedEntity.length == 1 )
      return
    let entity = this.classesAndProps[this.currentClassAndPrpsIndex]
    if(entity){
      this.impliedEntity.push(entity)
    }
  }

}
