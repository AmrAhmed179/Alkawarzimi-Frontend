import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { OntologyEntitiesService } from 'src/app/Services/Knowlege/ontology-entities.service';
import { OntologyTreeService } from 'src/app/Services/Ontology-Tree/ontology-tree.service';
import { DataService } from 'src/app/core/services/data.service';
import { NotifyService } from 'src/app/core/services/notify.service';

@Component({
  selector: 'vex-parent-ontolgy-tree',
  templateUrl: './parent-ontolgy-tree.component.html',
  styleUrls: ['./parent-ontolgy-tree.component.scss']
})
export class ParentOntolgyTreeComponent implements OnInit {
  onDestroy$: Subject<void> = new Subject();
  projectId:string

  constructor(private route: ActivatedRoute,
    private _dataService: DataService,
    private fb:FormBuilder,
    private notify: NotifyService,
    public dialog: MatDialog,
    private router: Router,
    private _ontologyTreeService: OntologyTreeService,

  ) { }

  ngOnInit(): void {
    this._dataService.$project_bs.pipe(takeUntil(this.onDestroy$)).subscribe((project:any)=>{
      if(project){
      this.projectId = project._id
  }}
  )}
  goToEntities(){
    this.router.navigate([`/projects/${this.projectId}/knowledge/ontologyEntities`])
  }
  goToPropertiesTree(){
    this.router.navigate([`/projects/${this.projectId}/propertyTree`])
  }
  generateOntologyIntent() {
    this._ontologyTreeService.generateOntologyIntent({projectId:this.projectId}).subscribe((res:any)=>{
      if(res.status == 1){
        this.notify.openSuccessSnackBar("Intents Generated")
      }
    })
  }

  generateGraphDb() {
    this._ontologyTreeService.createGraphDb({projectId:this.projectId}).subscribe((res:any)=>{
      if(res.status == 1){
        this.notify.openSuccessSnackBar("GraphDb Generated")
      }
    })
  }
  viewOntolgyIntents(){
    this.router.navigate([`/projects/${this.projectId}/ViewOntoloyIntents`])
  }
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
