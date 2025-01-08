import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { action } from '@circlon/angular-tree-component/lib/mobx-angular/mobx-proxy';
import { Subject, takeUntil } from 'rxjs';
import { EntityModel } from 'src/app/Models/ontology-model/EntityCatogeryModel';
import { OntologyEntitiesService } from 'src/app/Services/Knowlege/ontology-entities.service';
import { DataService } from 'src/app/core/services/data.service';
import { NotifyService } from 'src/app/core/services/notify.service';

@Component({
  selector: 'vex-parent-edit-frame',
  templateUrl: './parent-edit-frame.component.html',
  styleUrls: ['./parent-edit-frame.component.scss']
})
export class ParentEditFrameComponent implements OnInit {
  onDestroy$: Subject<void> = new Subject();
  projectId:string
  entityId:string
  entities:EntityModel[]
  entity:EntityModel
  constructor(private route: ActivatedRoute,
    private _ontologyEntitiesService:OntologyEntitiesService,
    private _dataService: DataService,
    private fb:FormBuilder,
    private notify: NotifyService,
    public dialog: MatDialog,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this._dataService.$project_bs.pipe(takeUntil(this.onDestroy$)).subscribe((project:any)=>{
      if(project){
      this.projectId = project._id
    let itemId = this.route.snapshot.paramMap.get('Verb');
     this.entityId = this.route.snapshot.paramMap.get('entityId');
     this.getEntities()
  }}
  )}

  getEntities(){
    this._ontologyEntitiesService.getEntities(this.projectId, 'action', 1).subscribe((res:any)=>{
      debugger
      this.entities = res.entities
      this.entity = this.entities.find(x=>x._id == +this.entityId)
    })
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
