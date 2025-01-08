import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
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
  selector: 'vex-add-domain-property',
  templateUrl: './add-domain-property.component.html',
  styleUrls: ['./add-domain-property.component.scss']
})
export class AddDomainPropertyComponent implements OnInit {
  search:string = ''
  entityTypeValue:string = 'all'
  lang:string
  currentClassAndPrpsIndex:number
  classesAndPropsFilter:EntityModel[]
  classesAndProps:any[]
  constructor(private route: ActivatedRoute,
    private _ontologyEntitiesService:OntologyEntitiesService,
    private _dataService: DataService,
    private fb:FormBuilder,
    private notify: NotifyService,
    public dialog: MatDialog,
    private router: Router,
    private _optionsService:OptionsServiceService,
    @Inject(DIALOG_DATA) public data: {entities:any[]},
    public dialogRef: MatDialogRef<AddclassAsvalueComponent>
  ) { }

  ngOnInit(): void {
    debugger
    this.classesAndProps = this.data.entities
  }

  formChang(){
    debugger
    var search = this.search
      this.classesAndProps = this.data.entities.filter(x=>x.entityText.trim().includes(search.trim()))

  }

  clickOnList(entity:EntityModel, index){
    this.currentClassAndPrpsIndex = index
  }

  addDoamin(){
    debugger
    if(this.currentClassAndPrpsIndex || this.currentClassAndPrpsIndex == 0 ){
      let entity = this.classesAndProps[this.currentClassAndPrpsIndex]
      this.dialogRef.close(entity)
    }
  }

}
