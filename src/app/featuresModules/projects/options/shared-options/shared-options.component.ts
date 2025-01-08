import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subject, Subscription, take, takeUntil } from 'rxjs';
import { OptionsServiceService } from 'src/app/Services/options-service.service';
import { ProjectOptionsModel } from 'src/app/core/models/options-model';
import { NotifyService } from 'src/app/core/services/notify.service';

@Component({
  selector: 'vex-shared-options',
  templateUrl: './shared-options.component.html',
  styleUrls: ['./shared-options.component.scss']
})
export class SharedOptionsComponent implements OnInit {

  projectId:string
  projectOptions:ProjectOptionsModel = null
  onDestroy$: Subject<void> = new Subject();

  constructor(private _optionsService:OptionsServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private _notifyService:NotifyService) { }

  ngOnInit(): void {
    console.log("shared component on init")

     this.route.parent.params.pipe(takeUntil(this.onDestroy$)).subscribe((parmas:Params)=>{
      // debugger
      console.log("shared component inside params.subscribe")

      this.projectId = parmas["projectid"];
      this.getPropjectOptions()
    })
  }

  getPropjectOptions(){
    console.log("shared component inside getPropjectOptions")

    this._optionsService.getProjectOptions(this.projectId).subscribe((res:any)=>{
      // debugger
      console.log("shared component inside subscribe")

      if(res){
        this.projectOptions = res.project
        console.log('options',this.projectOptions)
        this._optionsService.projectOptions$.next(this.projectOptions)
      }
    })
  }
  SaveProjectOptions(){
    this._optionsService.projectOptions$.pipe(take(1)).subscribe(res=>{
      this.projectOptions = res
      this._optionsService.SaveProjectOptions(this.projectOptions).subscribe((res:any)=>{
        // if(res.status === 1){
          this._notifyService.openSuccessSnackBar('Successfuly Save all options')
        //}
      })
    })
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
