import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { Subject, takeUntil } from 'rxjs';
import { AnalyticServiceService } from 'src/app/Services/analytic-service.service';
import { SurveyFilter } from 'src/app/core/models/filterAnaylic';

@Component({
  selector: 'vex-survey-details',
  templateUrl: './survey-details.component.html',
  styleUrls: ['./survey-details.component.scss']
})
export class SurveyDetailsComponent implements OnInit {

  onDestroy$: Subject<void> = new Subject();

  pageNumber =1
  pageSize= 10
  totalItems:number;
  form:FormGroup
  surveyTypes:string[] = []
  surveys:any
  surveyFilter:SurveyFilter = new SurveyFilter();
  displayedColumns: string[] = ['surveyType','sysUserId','rate','comment', 'createDate'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor( private route:ActivatedRoute,
    private fb:FormBuilder,
    private _anayaticService:AnalyticServiceService) { }

  ngOnInit(): void {
    this._anayaticService.surveyFilter$.pipe(takeUntil(this.onDestroy$)).subscribe((res:any)=>{
      this.surveyFilter = res
      this.intializeForm()
      this.getSurveysTypes()
      this.getSurveyStatistics()

    })
  }
  search(){
    this.surveyFilter.surveyType = this.form.controls['SurveyType'].value
    this._anayaticService.surveyFilter$.next(this.surveyFilter)
    this.getSurveyStatistics()
  }
  getSurveysTypes(){
    this._anayaticService.getSurveysTypes(this.surveyFilter.chatBotId).subscribe((res:any)=>{
      this.surveyTypes = res
    })
  }

  getSurveyStatistics(){
    this._anayaticService.getSurveyStatistics(this.surveyFilter,this.pageSize,this.pageNumber).subscribe((res:any)=>{
      this.dataSource = new MatTableDataSource(res.output);
      this.totalItems = res.totalItems

    })
  }
  intializeForm(){
    this.form = this.fb.group({
      SurveyType:['']
    })
  }
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
   }
   addDate(date){
    debugger;
    //date = "7/2/2023 9:08:47 PM";
    let addedDate = new Date(date)
     addedDate.setTime(addedDate.getTime() + 3 * 60 * 60 * 1000);
     return (moment(addedDate)).format('MM/DD/YYYY, HH:mm:ss A')
   }
}
