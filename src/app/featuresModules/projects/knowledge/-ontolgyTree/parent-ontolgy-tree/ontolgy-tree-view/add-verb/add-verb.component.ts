import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { EntityModel } from 'src/app/Models/ontology-model/EntityCatogeryModel';
import { OntologyEntitiesService } from 'src/app/Services/Knowlege/ontology-entities.service';
import { DataService } from 'src/app/core/services/data.service';
import { AddclassAsvalueComponent } from '../../../../ontology-entities/parent-ontology-entities/ontology-entities/edit-frame/parent-edit-frame/selected-entity-frame/addclass-asvalue/addclass-asvalue.component';
import { NotifyService } from 'src/app/core/services/notify.service';
import { OptionsServiceService } from 'src/app/Services/options-service.service';

@Component({
  selector: 'vex-add-verb',
  templateUrl: './add-verb.component.html',
  styleUrls: ['./add-verb.component.scss']
})
export class AddVerbComponent implements OnInit {

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
    @Inject(DIALOG_DATA) public data: {entities:EntityModel[] ,type:string},
    public dialogRef: MatDialogRef<AddVerbComponent>
  ) { }

  ngOnInit(): void {
    this.classesAndProps = this.data.entities.filter(x=>x.entityType != "action")
  }

  formChang(){
    debugger
    var entityTypeValue = this.entityTypeValue
    var search = this.search


    if(search.trim() != ''){
      if(entityTypeValue == 'all'){
        this.classesAndProps = this.data.entities.filter(x=>x.verb.trim().includes(search.trim()) && x.entityType != "action")
        this.currentClassAndPrpsIndex = 0
      }
      else{
        this.classesAndProps = this.data.entities.filter(x=>x.verb.trim().includes(search.trim()) && x.entityType ==entityTypeValue && x.entityType != "action")
        this.currentClassAndPrpsIndex = 0
      }

    }
    else{
      if(entityTypeValue =='all'){
         this.classesAndProps =  this.data.entities.filter(x=>x.entityType != "action")
         this.currentClassAndPrpsIndex = 0
      }
      else{
        this.classesAndProps = this.data.entities.filter(x=> x.entityType ==entityTypeValue &&x.entityType != "action")
        this.currentClassAndPrpsIndex = 0
      }
    }

  }
  clickOnList(entity:EntityModel, index){
    this.currentClassAndPrpsIndex = index
  }

  addClass(){
    debugger
    if(this.currentClassAndPrpsIndex){
      let entity = this.classesAndProps[this.currentClassAndPrpsIndex]
      this.dialogRef.close(entity.senseId)
    }
  }

}
