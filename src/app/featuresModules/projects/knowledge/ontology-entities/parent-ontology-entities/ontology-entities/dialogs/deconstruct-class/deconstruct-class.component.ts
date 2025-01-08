import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { OntologyEntitiesService } from 'src/app/Services/Knowlege/ontology-entities.service';
import { DataService } from 'src/app/core/services/data.service';
import { NotifyService } from 'src/app/core/services/notify.service';
import { ArgumentMappingComponent } from '../argument-mapping/argument-mapping.component';
import { EntityModel } from 'src/app/Models/ontology-model/EntityCatogeryModel';

@Component({
  selector: 'vex-deconstruct-class',
  templateUrl: './deconstruct-class.component.html',
  styleUrls: ['./deconstruct-class.component.scss']
})
export class DeconstructClassComponent implements OnInit {
  currentIndex:number
  currentIndex2:number
  entities:EntityModel[]
  ontologyEntities:EntityModel[]
  ontologyEntitiesFilter:EntityModel[]
  restrictedClassesList:EntityModel[] = []
  form:FormGroup
  constructor( private _ontologyEntitiesService:OntologyEntitiesService,
    private route: ActivatedRoute,
    private _dataService: DataService,
    private fb:FormBuilder,
    private notify: NotifyService,
    @Inject(DIALOG_DATA) public data: { entityId:any,cmp:any,sbj:any,obj:any,features:any,projectId:any},
   public dialogRef: MatDialogRef<DeconstructClassComponent>) { }

   ngOnInit(): void {
    this.getEntities()
    this.intiateForm()
  }
  intiateForm(){
    this.form = this.fb.group({
      'search':[''],
    })
  }
  getEntities(){
    this._ontologyEntitiesService.getEntities(this.data.projectId, 'action', 1).subscribe((res:any)=>{
      debugger
      this.entities = res.entities
      this.sortEntites()
    })
  }

  sortEntites(){
    var allParents = this.entities.filter(x=>x.parentId == 0)
    debugger
     this.ontologyEntities = allParents.sort((n1,n2) => {
      if (n1._id > n2._id) {
          return 1;
      }

      if (n1._id < n2._id) {
          return -1;
      }

      return 0;
  });

  this.ontologyEntitiesFilter = this.ontologyEntities
  }
  formChang(){
    debugger
    var search= this.form?.controls['search'].value
    var filteredData:EntityModel[]

      filteredData = this.ontologyEntitiesFilter.filter(x=>x.entityInfo[0].entityText.trim().includes(search.trim()))

      this.ontologyEntities = filteredData
  }

  clickOnList(entity:EntityModel, index){
    this.currentIndex = index
  }
  clickOnList2(entity:EntityModel, index){
    this.currentIndex2 = index
  }
  addRestrictedClass(){
    if(this.currentIndex != -1){
      var entity = this.ontologyEntities[this.currentIndex]
      var searchEntity = this.restrictedClassesList.find(x=>x._id == entity._id)
      if(searchEntity){
        this.notify.openFailureSnackBar("Restriction is added before")
      }
      else{
        this.restrictedClassesList.push(entity)
      }
    }
  }
  deleteRestrictedClas(index:number){
    this.restrictedClassesList.splice(index,1)
  }
}
