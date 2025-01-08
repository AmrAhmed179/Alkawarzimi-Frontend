import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/core/services/data.service';
import { NotifyService } from 'src/app/core/services/notify.service';
import { EntityModel } from 'src/app/Models/ontology-model/EntityCatogeryModel';
import { NodeModel } from 'src/app/Models/ontology-model/node';
import { OntologyEntitiesService } from 'src/app/Services/Knowlege/ontology-entities.service';
import { OptionsServiceService } from 'src/app/Services/options-service.service';

@Component({
  selector: 'vex-replace-property',
  templateUrl: './replace-property.component.html',
  styleUrls: ['./replace-property.component.scss']
})
export class ReplacePropertyComponent implements OnInit {

  search:string = ''
  entityTypeValue:string = 'class'
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
    public dialogRef: MatDialogRef<ReplacePropertyComponent>
  ) { }

  ngOnInit(): void {
      this.classes = this.data.entities.filter(x=>x.entityType == "class")

  }

  formChang(){
    debugger
    var search = this.search
    if(this.entityTypeValue == 'class' ){
      this.classes = this.data.entities.filter(x=>x.entityInfo[0].entityText.trim().includes(search.trim()) && x.entityType == "class")
      this.currentClassIndex = 0
    }
  }
  clickOnClassesList(entity:EntityModel, index){
    this.currentClassIndex = index
  }


  addClass(){
    debugger
    if((this.currentClassIndex || this.currentClassIndex == 0) && this.entityTypeValue == 'class'){
      let entity = this.classes[this.currentClassIndex]
      this.dialogRef.close(entity._id)
    }
  }
}
