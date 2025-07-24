import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/core/services/data.service';
import { EntityModel } from 'src/app/Models/ontology-model/EntityCatogeryModel';
import { OntologyEntitiesService } from 'src/app/Services/Knowlege/ontology-entities.service';
import { OptionsServiceService } from 'src/app/Services/options-service.service';
import { AddclassAsvalueComponent } from '../../../ontology-entities/parent-ontology-entities/ontology-entities/edit-frame/parent-edit-frame/selected-entity-frame/addclass-asvalue/addclass-asvalue.component';
import { NotifyService } from 'src/app/core/services/notify.service';

@Component({
  selector: 'vex-manage-attached-frames',
  templateUrl: './manage-attached-frames.component.html',
  styleUrls: ['./manage-attached-frames.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class ManageAttachedFramesComponent implements OnInit {

  arg:string = '0'
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
    public dialogRef: MatDialogRef<ManageAttachedFramesComponent>
  ) { }

  ngOnInit(): void {
    debugger
    this.classesAndProps = this.data.entities.filter(x=>x.entityType == "action")
  }

  formChang(){
    debugger
    var search = this.search
    this.classesAndProps = this.data.entities.filter(x=>x.entityInfo[0].entityText.trim().includes(search.trim()) && x.entityType == "action")
  }
  clickOnList(entity:EntityModel, index){
    this.currentClassAndPrpsIndex = index
  }

  addClass(){
    debugger
    if(this.currentClassAndPrpsIndex || this.currentClassAndPrpsIndex == 0 ){
      let entity = this.classesAndProps[this.currentClassAndPrpsIndex]
      this.dialogRef.close({FrameEntityId:entity._id,arg:this.arg})
    }
  }


}
