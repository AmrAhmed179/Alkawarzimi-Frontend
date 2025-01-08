import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AnalyticServiceService } from 'src/app/Services/analytic-service.service';

@Component({
  selector: 'vex-leadgeneration',
  templateUrl: './leadgeneration.component.html',
  styleUrls: ['./leadgeneration.component.scss']
})
export class LeadgenerationComponent implements OnInit {
  onDestroy$: Subject<void> = new Subject();
  filter;
  projectId
  startDate
  endDate
  id:string
  constructor(private _analyticalService:AnalyticServiceService) { }

  ngOnInit(): void {
    this._analyticalService.filterAnylatic$.pipe(takeUntil(this.onDestroy$)).subscribe(res=>{
      this.filter = res
      //this.endDate = res.endDate.toISOString()/// before change date
      this.endDate = res.endDate/// after change date
      //this.startDate = res.startDate.toISOString() // before change date
      this.startDate = res.startDate  // after change date
      this.projectId = res.chatBotId
    })
  }
  getLeadGenerationReport(id:string){
    this.id = id
    this._analyticalService.GetLeadGenerationReport(this.endDate,this.startDate, this.projectId,this.id).subscribe(res=>{
      debugger


    })
  }
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
