import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { EntityCatogeryModel } from 'src/app/Models/ontology-model/EntityCatogeryModel';
import { OntologyEntitiesService } from 'src/app/Services/Knowlege/ontology-entities.service';
import { DataService } from 'src/app/core/services/data.service';
import { NotifyService } from 'src/app/core/services/notify.service';
import { CreateOntologyEntityComponent } from './dialogs/create-ontology-entity/create-ontology-entity.component';
import { ExtractEntitiesByAiComponent } from 'src/app/featuresModules/projects/entities-Ai/extract-entities-by-ai/extract-entities-by-ai.component';

@Component({
  selector: 'vex-ontology-entities',
  templateUrl: './ontology-entities.component.html',
  styleUrls: ['./ontology-entities.component.scss']
})
export class OntologyEntitiesComponent implements OnInit {

  onDestroy$: Subject<void> = new Subject();
  category:EntityCatogeryModel[]
  factCatogeries:any[]
  projectId:string
  Type:string
  constructor(private _ontologyEntitiesService:OntologyEntitiesService,
    private route: ActivatedRoute,
    private _dataService: DataService,
    private _notifyService:NotifyService,
    public dialog: MatDialog,
    private router: Router

    ) { }
  ngOnInit(): void {
    this._dataService.$project_bs.pipe(takeUntil(this.onDestroy$)).subscribe((project:any)=>{
      this.projectId = project._id
      this.getCategory()
      //this.Type = 'action'
       const url = this.router.url;
       this.Type =  url.substring(url.lastIndexOf('/') + 1);
    })
  }

  getCategory(){
    this._ontologyEntitiesService.getCategory(this.projectId).subscribe((res:EntityCatogeryModel[])=>{
      debugger
      this.category = res
    })
  }
  testEnitiesStemes(){
    this._ontologyEntitiesService.testEnitiesStemes(this.projectId).subscribe((res:any)=>{
     if(res.status == 1)
       this._notifyService.openSuccessSnackBar("Entities Stemes Report is Ready")
    })
  }
  setCategoryName(type){
    debugger
    this.Type = type
  }
  openCreateEntity(){
    debugger
    const dialogRef = this.dialog.open(CreateOntologyEntityComponent, {
      data: {entityId:0, projectId:this.projectId,mode:'Entity' , Type:this.Type, _id:0},},
    );
    dialogRef.afterClosed().subscribe((res:any) => {
      if(res)
       this._ontologyEntitiesService.ReloadEntitesInCreation$.next('reload')
    })
  }
  openEntityAIDialoge(){
    const dialogRef = this.dialog.open(ExtractEntitiesByAiComponent, {height:"900px",width:"1500px"},
    );
    dialogRef.afterClosed().subscribe((res:any) => {
      if(res)
       this._ontologyEntitiesService.ReloadEntitesInCreation$.next('reload')
    })
  }
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
