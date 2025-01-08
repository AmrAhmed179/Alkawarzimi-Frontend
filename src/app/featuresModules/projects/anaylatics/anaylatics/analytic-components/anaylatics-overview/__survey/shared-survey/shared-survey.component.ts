import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import moment from 'moment';
import { AnalyticServiceService } from 'src/app/Services/analytic-service.service';
import { SurveyFilter } from 'src/app/core/models/filterAnaylic';

@Component({
  selector: 'vex-shared-survey',
  templateUrl: './shared-survey.component.html',
  styleUrls: ['./shared-survey.component.scss']
})
export class SharedSurveyComponent implements OnInit {

  range:any
 datetimeNow:Date;
 startDate:Date;
 endDate:Date;
 chatBotId:number;
  constructor(private route: ActivatedRoute,private _analyticalService:AnalyticServiceService) { }

  ngOnInit(): void {
    this.route.parent.params.subscribe((parmas:Params)=>{
      this.chatBotId = parmas["projectid"];
    })
      debugger


      this.datetimeNow= new Date();// create a new Date object with the current date and time
      let endDteUTC = new Date()
      let myDate = new Date();
      //myDate.setDate(myDate.getDate() -12).toLocaleString()
       let convertDate = myDate
      this.startDate = new Date(convertDate.getDate())

      this.range = new FormGroup({
      startDate: new FormControl(new Date()),
      endDate: new FormControl(new Date()),
    });
    var  filter = new SurveyFilter();
    filter.chatBotId = this.chatBotId;
    filter.startDate = (moment(this.range.get('startDate').value)).format('MM/DD/YYYY')
    filter.endDate = (moment(this.range.get('endDate').value)).format('MM/DD/YYYY')

    this._analyticalService.surveyFilter$.next(filter);

  }
  refeshData(){
    var  filter = new SurveyFilter();
    filter.chatBotId = this.chatBotId;
    filter.startDate = (moment(this.range.get('startDate').value)).format('MM/DD/YYYY')
    filter.endDate = (moment(this.range.get('endDate').value)).format('MM/DD/YYYY')

    this._analyticalService.surveyFilter$.next(filter);
  }
}
