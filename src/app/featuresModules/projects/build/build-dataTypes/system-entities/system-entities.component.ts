import { ProjectModel } from './../../../../../core/models/project-model';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs';
import { SystemEntitiesService } from 'src/app/Services/Build/system-entities.service';
import { PreDefinedEntity } from 'src/app/core/models/PreDefinedEntity';
import { SystemEntity } from 'src/app/core/models/systemEntity';
import { DataService } from 'src/app/core/services/data.service';
import { NotifyService } from 'src/app/core/services/notify.service';

@Component({
  selector: 'vex-system-entities',
  templateUrl: './system-entities.component.html',
  styleUrls: ['./system-entities.component.scss']
})
export class SystemEntitiesComponent implements OnInit {

  chatBotId: number;
  entities:SystemEntity[]=[];
  preDefinedEntity:PreDefinedEntity[]=[];
  displayedColumns: string[] = ['name', 'description', 'Status'];
  

  dataSource: MatTableDataSource<PreDefinedEntity>;
  constructor(
              private _systemEntitiesService:SystemEntitiesService,
              private notify: NotifyService,
              private route: ActivatedRoute,
              private _dataService:DataService
              ) { }

  ngOnInit(): void {
    this._dataService.$project_bs.subscribe((project:ProjectModel)=>{
      if(project){
        this.chatBotId=+project._id
        this.GetSystemEntities();
      }
    })
  
  }

  GetSystemEntities(){
    this._systemEntitiesService.GetSystemEntities(this.chatBotId).subscribe(respons => {
      if (respons) {
        if(respons["status"] == 1){
          this.entities=respons["entities"];
          this.GetPreDefinedEntity();
        }
        else{
          this.notify.openFailureSnackBar(respons["message"]);
        }
      }
    })

  }
  GetPreDefinedEntity(){
    this._systemEntitiesService.GetPreDefinedEntity().subscribe((respons:PreDefinedEntity[]) => {
      if (respons) {
        this.preDefinedEntity=respons;
        this.preDefinedEntity.map(entity=>{
          entity.status=this.entities.findIndex(a=>a.entityId==entity.name)!=-1?true:false;
        })

        this.dataSource = new MatTableDataSource(this.preDefinedEntity);
      }
    },error=>{
      this.notify.openFailureSnackBar(error.error.Message);
    })
  }

  toggleChange(entity:PreDefinedEntity,event:MatSlideToggleChange){
    let systemEntities:SystemEntity;
    systemEntities={
      entityId: entity.name,
      entity: entity.name,
      sysEntity: true,
      description:null,
      values: [],
      sourceBot: null,
    }
    if(event.checked==true){
      this._systemEntitiesService.CreateSystemEntity(systemEntities,this.chatBotId).subscribe(respons=>{
        if(respons){
          if(respons["status"]==1){
            this.GetSystemEntities()
            this.notify.openSuccessSnackBar("This Entity Successfully Added")
          }
          else{
            this.notify.openFailureSnackBar(respons["message"]); 
          }
        }
      })
    }
    else{
      this._systemEntitiesService.DeleteSystemEntity(systemEntities,this.chatBotId).subscribe(respons=>{
        if(respons){
          if(respons["status"]==1){
            this.GetSystemEntities()
            this.notify.openSuccessSnackBar("This Entity Successfully Removed")
          }
          else{
            this.notify.openFailureSnackBar(respons["message"]); 
          }
        }
      })
    }
  }

}
