import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EntityModel } from 'src/app/Models/ontology-model/EntityCatogeryModel';
import { AddclassAsvalueComponent } from '../../../ontology-entities/parent-ontology-entities/ontology-entities/edit-frame/parent-edit-frame/selected-entity-frame/addclass-asvalue/addclass-asvalue.component';
import { NodeModel } from 'src/app/Models/ontology-model/node';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/core/services/data.service';
import { OntologyEntitiesService } from 'src/app/Services/Knowlege/ontology-entities.service';
import { OptionsServiceService } from 'src/app/Services/options-service.service';
import { NotifyService } from 'src/app/core/services/notify.service';

@Component({
  selector: 'vex-add-sibbling-and-child-property',
  templateUrl: './add-sibbling-and-child-property.component.html',
  styleUrls: ['./add-sibbling-and-child-property.component.scss']
})
export class AddSibblingAndChildPropertyComponent implements OnInit {
  search:string = ''
  entityTypeValue:string = 'dataproperty'
  lang:string
  currentClassIndex:number
  currentRestrictedClassIndex:number
  currentDataPropertyIndex:number
  classesAndPropsFilter:EntityModel[]
  classes:EntityModel[]
  restrictedClasses:EntityModel[]
  dataProperty:NodeModel[]
  constructor(private route: ActivatedRoute,
    private _ontologyEntitiesService:OntologyEntitiesService,
    private _dataService: DataService,
    private fb:FormBuilder,
    private notify: NotifyService,
    public dialog: MatDialog,
    private router: Router,
    private _optionsService:OptionsServiceService,
    @Inject(DIALOG_DATA) public data: {entities:EntityModel[] ,propertiesList:NodeModel[],type:string},
    public dialogRef: MatDialogRef<AddSibblingAndChildPropertyComponent>
  ) { }

  ngOnInit(): void {
      this.classes = this.data.entities.filter(x=>x.entityType == "class")
      this.restrictedClasses = this.data.entities.filter(x=>x.entityType == "prop")
      this.dataProperty = this.data.propertiesList
  }

  formChang(){
    debugger
    var search = this.search
    if(this.entityTypeValue == 'class' ){
      this.classes = this.data.entities.filter(x=>x.entityInfo[0].entityText.trim().includes(search.trim()) && x.entityType == "class")
      this.currentClassIndex = 0
    }
    else if (this.entityTypeValue == 'restricted' ){
      this.restrictedClasses = this.data.entities.filter(x=>x.entityInfo[0].entityText.trim().includes(search.trim()) && x.entityType == "prop")
      this.currentRestrictedClassIndex = 0
    }
    else{
      this.dataProperty = this.data.propertiesList.filter(x=>x.entityText.trim().includes(search.trim()))
      this.currentDataPropertyIndex = 0
    }

  }
  clickOnClassesList(entity:EntityModel, index){
    this.currentClassIndex = index
  }

  clickOnRestrictedClassesList(entity:EntityModel, index){
    this.currentRestrictedClassIndex = index
  }
   clickOnDataPropertyList(entity:NodeModel, index){
    this.currentDataPropertyIndex = index
  }

  addClass(){
    debugger
    if((this.currentClassIndex || this.currentClassIndex == 0) && this.entityTypeValue == 'class'){
      let entity = this.classes[this.currentClassIndex]
      this.dialogRef.close(entity._id)
    }
    if((this.currentRestrictedClassIndex || this.currentRestrictedClassIndex == 0) && this.entityTypeValue == 'restricted'){
      let entity = this.classes[this.currentRestrictedClassIndex]
      this.dialogRef.close(entity._id)
    }
    if((this.currentDataPropertyIndex || this.currentDataPropertyIndex == 0) && this.entityTypeValue == 'dataproperty'){
      let property = this.dataProperty[this.currentDataPropertyIndex]
      this.dialogRef.close(property.node_id)
    }
  }

}
