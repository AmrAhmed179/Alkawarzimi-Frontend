import { Component, OnInit } from '@angular/core';
import { set } from 'date-fns';
import { Subject, takeUntil } from 'rxjs';
import { AnalyticServiceService } from 'src/app/Services/analytic-service.service';
import { SurveyFilter, filterAnalytical } from 'src/app/core/models/filterAnaylic';

export type chartOptionsColumn = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  colors: string[];
  legend: ApexLegend;
};
export type columnData = {
  name:string
  data:number[]
};
@Component({
  selector: 'vex-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit {
  onDestroy$: Subject<void> = new Subject();
  filter:SurveyFilter =  new SurveyFilter();
  allSurviesCount:number = 0
  spainServiceCount:number = 0
  statistics:any
  uniqueSurveyType:string[] = []
  surviesUsageCount:number[] = []
  surviesAVerageRate:number[] = []
  averageSurviesRateList:any
  allAverageSurviesRateList:any
  averageSurviesRate:string
  allAverageSurviesRate:string

  public chartOptionsColumn3: Partial<chartOptionsColumn>;
  columnChartSeries3:columnData[] = []
  public chartOptionsColumn4: Partial<chartOptionsColumn>;
  columnChartSeries4:columnData[] = []

  public chartOptionsColumnCSAT: Partial<chartOptionsColumn>;
  columnChartSeriesCSAT:columnData[] = []
  CSAT:number[] = []

  public chartOptionsColumnDSAT: Partial<chartOptionsColumn>;
  columnChartSeriesDSAT:columnData[] = []
  DSAT:number[] = []

  constructor(private _analyticalService:AnalyticServiceService) { }

  ngOnInit(): void {
    this._analyticalService.surveyFilter$.pipe(takeUntil(this.onDestroy$)).subscribe(res=>{
      this.filter = res
      //this.filter.modeAgent = false
      this.getSurviesStatistics()
      this.getSurviesCounters()
    })
  }
  getSurviesCounters(){
    this._analyticalService.GetSurviesCounters(this.filter).subscribe((res:any)=>{
      if(res){
        this.allSurviesCount = res.allSurviesCount
        this.spainServiceCount = res.surviesCount
        this.averageSurviesRateList = JSON.parse(res.averageSurviesRate)
        this.allAverageSurviesRate = this.getAverageSurviesRate(this.averageSurviesRateList)
        this.allAverageSurviesRateList = JSON.parse(res.allAverageSurviesRate)

        this.averageSurviesRate = this.getAverageSurviesRate(this.allAverageSurviesRateList)
      }
    })
  }

  getSurviesStatistics(){
    this._analyticalService.GetSurviesStatistics(this.filter).subscribe((res:any)=>{
      if(res){
        this.statistics = JSON.parse(res.statistics)
        this.getUniqueSurveyType(this.statistics)
        this.getSurviesUsageForEachType(this.statistics)
        this.getCSATAndDSAT(this.statistics)
        this.setChartOptions()
      }
    })
  }

  getUniqueSurveyType(statics){
    let x:string[] = []
    this.surviesUsageCount =  []
    this.surviesAVerageRate = []
    this.columnChartSeries3 = []
    this.columnChartSeries4 = []

    statics.forEach(element => {
       x.push(element._id.surveyType)
    });
    this.uniqueSurveyType  = Array.from(new Set(x))
  }
  getSurviesUsageForEachType(statics){
    let x:any[] = []
    this.uniqueSurveyType.forEach(element => {
      let y:number = 0
      let z:number = 0
      x = statics.filter(a=>a._id.surveyType == element)
      x.forEach(ele=>{
        y += ele.count
        z += +ele._id.rate
      })
      this.surviesUsageCount.push(y)
      this.surviesAVerageRate.push(z/x.length)
    });

    this.columnChartSeries3.push({name:"count",data:this.surviesUsageCount})
    this.columnChartSeries4.push({name:"Rate",data:this.surviesAVerageRate})
  }
  getAverageSurviesRate(list){
    debugger
    if(list.length <1){
      return "0.00"
    }
    else{
      let allCount = 0
      let allRate = 0
      list.forEach(element => {
        if(isNaN(+element._id.rate)){
          return
       }
       allRate += +element._id.rate * element.count
       allCount += element.count
      });
     // return ((allRate/(allCount*5)) * 100).toString()
      return ((allRate/(allCount*5)) * 100).toFixed(2)
    }

  }
  getCSATAndDSAT(statics){
    let x:any[] = []
    this.CSAT = []
    this.DSAT = []
    this.columnChartSeriesCSAT = []
    this.columnChartSeriesDSAT = []
    this.uniqueSurveyType.forEach(element => {
      let allCount = 0
      let countCSAT =0
      let countDSAT =0

      x = statics.filter(a=>a._id.surveyType == element)
      x.forEach(ele=>{
        if(ele._id.rate ==="4" || ele._id.rate ==="5" ||ele._id.rate ==="1" || ele._id.rate ==="2"){
          allCount += ele.count
        }
        if(ele._id.rate ==="4" || ele._id.rate ==="5"){
          countCSAT += ele.count
        }
        else if(ele._id.rate ==="1" || ele._id.rate ==="2"){
          countDSAT += ele.count
        }
      })

      this.CSAT.push(Number.parseFloat((countCSAT/allCount).toFixed(2)))
      this.DSAT.push(Number.parseFloat((countDSAT/allCount).toFixed(2)) )
    });

    this.columnChartSeriesCSAT.push({name:"percentage",data:this.CSAT})
    this.columnChartSeriesDSAT.push({name:"percentage",data:this.DSAT})
  }
  setChartOptions(){
    this.chartOptionsColumn3 = {
      series: [],
      chart: {
        height: 350,
        type: "bar",
        events: {
          click: function(chart, w, e) {
            // console.log(chart, w, e)
          }
        }
      },
      colors: [
        "#008FFB",
        "#00E396",
        "#FEB019",
        "#FF4560",
        "#775DD0",

      ],
      plotOptions: {
        bar: {
          columnWidth: "45%",
          distributed: true
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
      grid: {
        show: false
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: [
              "#008FFB",
              "#00E396",
              "#FEB019",
              "#FF4560",

            ],
            fontSize: "12px"
          }
        }
      }
    };
    this.chartOptionsColumn3.xaxis.categories = this.uniqueSurveyType

    this.chartOptionsColumn4 = {
      series: [],
      chart: {
        height: 350,
        type: "bar",
        events: {
          click: function(chart, w, e) {
            // console.log(chart, w, e)
          }
        }
      },
      colors: [
        "#008FFB",
        "#00E396",
        "#FEB019",
        "#FF4560",
        "#775DD0",

      ],
      plotOptions: {
        bar: {
          columnWidth: "45%",
          distributed: true
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
      grid: {
        show: false
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: [
              "#008FFB",
              "#00E396",
              "#FEB019",
              "#FF4560",

            ],
            fontSize: "12px"
          }
        }
      }
    };
    this.chartOptionsColumn4.xaxis.categories = this.uniqueSurveyType

    this.chartOptionsColumnCSAT = {
      series: [],
      chart: {
        height: 350,
        type: "bar",
        events: {
          click: function(chart, w, e) {
            // console.log(chart, w, e)
          }
        }
      },
      colors: [
        "#008FFB",
        "#00E396",
        "#FEB019",
        "#FF4560",
        "#775DD0",

      ],
      plotOptions: {
        bar: {
          columnWidth: "45%",
          distributed: true
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
      grid: {
        show: false
      },
      yaxis:{
        max:1
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: [
              "#008FFB",
              "#00E396",
              "#FEB019",
              "#FF4560",

            ],
            fontSize: "12px"
          }
        }
      }
    };
    this.chartOptionsColumnCSAT.xaxis.categories = this.uniqueSurveyType

    this.chartOptionsColumnDSAT = {
      series: [],
      chart: {
        height: 350,
        type: "bar",
        events: {
          click: function(chart, w, e) {
            // console.log(chart, w, e)
          }
        }
      },
      colors: [
        "#008FFB",
        "#00E396",
        "#FEB019",
        "#FF4560",
        "#775DD0",

      ],
      plotOptions: {
        bar: {
          columnWidth: "45%",
          distributed: true
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
      grid: {
        show: false
      },
      yaxis:{
        max:1
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: [
              "#008FFB",
              "#00E396",
              "#FEB019",
              "#FF4560",

            ],
            fontSize: "12px"
          }
        }
      }
    };
    this.chartOptionsColumnDSAT.xaxis.categories = this.uniqueSurveyType
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
