import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/core/services/data.service';
import { EntityModel } from 'src/app/Models/ontology-model/EntityCatogeryModel';
import { OntologyEntitiesService } from 'src/app/Services/Knowlege/ontology-entities.service';
import { OptionsServiceService } from 'src/app/Services/options-service.service';
import { AddVerbComponent } from '../../../parent-ontolgy-tree/ontolgy-tree-view/add-verb/add-verb.component';
import { NotifyService } from 'src/app/core/services/notify.service';
import { type } from 'os';

@Component({
  selector: 'vex-add-individual-class-frame',
  templateUrl: './add-individual-class-frame.component.html',
  styleUrls: ['./add-individual-class-frame.component.scss']
})


export class AddIndividualClassFrameComponent implements OnInit {

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
    public dialogRef: MatDialogRef<AddIndividualClassFrameComponent>
  ) { }

  ngOnInit(): void {
    this.entityTypeValue = this.data.type
    this.classesAndProps = this.data.entities.filter(x=>x.entityType == this.data.type)
  }

  formChang(){
    debugger
    var search = this.search
    if(search.trim() != '' && this.entityTypeValue != 'all'){
        this.classesAndProps = this.data.entities.filter(x=>x.entityInfo[0].entityText.trim().includes(search.trim()) && x.entityType == this.entityTypeValue)
        this.currentClassAndPrpsIndex = 0
    }
    else if(search.trim() != '' && this.entityTypeValue == 'all'){
        this.classesAndProps = this.data.entities.filter(x=>x.entityInfo[0].entityText.trim().includes(search.trim()))
        this.currentClassAndPrpsIndex = 0
    }
    else if ( this.entityTypeValue == 'all'){
      this.classesAndProps = this.data.entities.filter(x=>x.entityInfo[0].entityText.trim().includes(search.trim()))
      this.currentClassAndPrpsIndex = 0
    }
  }

  clickOnList(entity:EntityModel, index){
    this.currentClassAndPrpsIndex = index
  }

  addClass(){
    debugger
    if(this.currentClassAndPrpsIndex || this.currentClassAndPrpsIndex == 0 ){
      let entity = this.classesAndProps[this.currentClassAndPrpsIndex]
      this.dialogRef.close(entity._id)
    }
  }

}
