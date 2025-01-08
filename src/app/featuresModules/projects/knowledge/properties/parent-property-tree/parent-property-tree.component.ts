import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DataService } from 'src/app/core/services/data.service';
import { NotifyService } from 'src/app/core/services/notify.service';
import { OntologyTreeService } from 'src/app/Services/Ontology-Tree/ontology-tree.service';

@Component({
  selector: 'vex-parent-property-tree',
  templateUrl: './parent-property-tree.component.html',
  styleUrls: ['./parent-property-tree.component.scss']
})
export class ParentPropertyTreeComponent implements OnInit {

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
  goToOntologyTree(){
    this.router.navigate([`/projects/${this.projectId}/ontologyTree`])
  }



  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
