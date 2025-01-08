import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DataService } from 'src/app/core/services/data.service';
import { NotifyService } from 'src/app/core/services/notify.service';

@Component({
  selector: 'vex-parent-ontology-entities',
  templateUrl: './parent-ontology-entities.component.html',
  styleUrls: ['./parent-ontology-entities.component.scss']
})
export class ParentOntologyEntitiesComponent implements OnInit {

  onDestroy$: Subject<void> = new Subject();
  projectId:string

  constructor(private route: ActivatedRoute,
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
  }}
  )}
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
  goToOntologyTree(){
    this.router.navigate([`/projects/${this.projectId}/ontologyTree`])
  }
  goToPropertiesTree(){
    this.router.navigate([`/projects/${this.projectId}/propertyTree`])
  }
}
