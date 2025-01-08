import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ifError } from 'assert';
import moment from 'moment';
import { Subject, takeUntil } from 'rxjs';
import { ChartComponent } from 'src/@vex/components/chart/chart.component';
import { AnalyticServiceService } from 'src/app/Services/analytic-service.service';
import { filterAnalytical } from 'src/app/core/models/filterAnaylic';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  colors:any
};


export type columnData = {
  name:string
  data:number[]
};
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
export type ChartOptionsArea = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};
@Component({
  selector: 'vex-anaylatics-overview',
  templateUrl: './anaylatics-overview.component.html',
  styleUrls: ['./anaylatics-overview.component.scss']
})
export class AnaylaticsOverviewComponent implements OnInit {
  onDestroy$: Subject<void> = new Subject();

  updateTimer1:any;
  updateTimer2:any;
  updateTimer3:any;
  sessionArray:any[] = []
  userArray:any[] = []
  dateArray:string[] = []
  intents:any[] = []
  intentsId:string[] =[]
  itentCount:number[] = []
  filter:filterAnalytical = null;
  allUserCount:number;
  uniqueUserCount:number;
  onlineUserCount:number;
  allSessionsCount:number;
  sessionsCount:number
  loggedSessionsCount:number
  conversationsCount:number
  failureConversationsCount:number
  successConversationsCount:number
  keywordEscalations:number
  repatedFailureEscalations:number
  totalEscalations:number
  unsupportedLanguageEscalations:number
  welcomeIntentsCount:number
  clientsRequestEscalations:number
  averageUtteranceCount:number
  pieChartSeries:number[] = []

  columnChartSeries:columnData[] = []
  columnChartSeriesdata:number[] =[]

  columnChartSeries2:columnData[] = []
  columnChartSeriesdata2:number[] =[]

  areaChartSeries:any[] = []
  sessionss:number[] = []
  userss:number[] = []
  areaXAxsix:any = {}

  listOfIntent:any[] =[]
  listOfUnderStandIntent:any[] =[]
  listOfRealNameIntent:string[] =[]
  //@Input() allUserCount: number
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public chartOptionsColumn: Partial<chartOptionsColumn>;
  public chartOptionsColumn2: Partial<chartOptionsColumn>;
  public chartOptionsArea: Partial<ChartOptionsArea>;
  constructor( private _analyticalService:AnalyticServiceService) {

  }

  ngOnInit(): void {

    let y = window.location.href.split("/").pop()
      if(y==='overview' ){
        this._analyticalService.filterAnylatic$.pipe(takeUntil(this.onDestroy$)).subscribe(res=>{
          this.filter =res
          console.log("filter",this.filter)
          if(this.listOfIntent.length < 1){
            this.getIntents();
          }
          if(this.listOfUnderStandIntent.length < 1){
            this.getUnderstandingIntent()
          }
          this.getUniqueUsers();
          this.GetOnlineUsersCount();
          this.GetUsersCount();
          this.GetStatistics();
        })
      }
  }

  getUniqueUsers(){
    this._analyticalService.GetUniqeUsersCount(this.filter.chatBotId).subscribe((res:any)=>{
      if(res){
        this.allUserCount = res
        clearTimeout(this.updateTimer1);
        this.updateTimer1 = setTimeout(() => {
          this.getUniqueUsers();
        }, 20* 1000);
      }
    })
  }
  GetOnlineUsersCount(){
    this._analyticalService.GetOnlineUsersCount(this.filter.chatBotId).subscribe((res:any)=>{
      if(res){
        this.onlineUserCount = res.count
        clearTimeout(this.updateTimer2);
        this.updateTimer2 = setTimeout(() => {
          this.GetOnlineUsersCount();
        }, 20* 1000);
      }

    })
  }
  GetUsersCount(){

      this._analyticalService.GetUsersCount(this.filter).subscribe((res:any)=>{
        if(res){
          this.uniqueUserCount = res.usersCount
          clearTimeout(this.updateTimer3);
          this.updateTimer3 = setTimeout(() => {
            this.GetUsersCount();
          }, 20* 1000);
        }
      })
  }


  GetStatistics(){
    this._analyticalService.GetStatistics(this.filter).subscribe((res:any)=>{
      this.pieChartSeries = []
      this.columnChartSeries= []
      this.columnChartSeriesdata =[]
      this.columnChartSeries2= []
      this.columnChartSeriesdata2 =[]

      this.intents = []
      this.intentsId =[]
      this.itentCount = []

      this.areaChartSeries = []
      this.dateArray = []
      this.listOfRealNameIntent = []
      this.divideDateRng()
      this.allSessionsCount = res.statistics.allSessionsCount
      this.sessionsCount = res.statistics.sessionsCount
      this.loggedSessionsCount = res.statistics.loggedSessionsCount
      this.conversationsCount = res.statistics.conversationsCount
      this.failureConversationsCount = res.statistics.failureConversationsCount
      this.successConversationsCount = res.statistics.successConversationsCount
      this.keywordEscalations = res.statistics.keywordEscalations
      this.repatedFailureEscalations = res.statistics.repatedFailureEscalations
      this.totalEscalations = res.statistics.totalEscalations
      this.unsupportedLanguageEscalations = res.statistics.unsupportedLanguageEscalations
      this.welcomeIntentsCount = res.statistics.welcomeIntentsCount
      this.clientsRequestEscalations = res.statistics.clientsRequestEscalations
      this.averageUtteranceCount = res.statistics.averageUtteranceCount
      this.pieChartSeries.push(this.successConversationsCount,this.failureConversationsCount)
      this.columnChartSeriesdata.push(res.statistics.channels.web,res.statistics.channels.mobile,res.statistics.channels.whatsapp,
      res.statistics.channels.twitter,res.statistics.channels.faceBook,res.statistics.channels.telegram,res.statistics.channels.agents)
      this.intents=res.statistics.intents
      this.columnChartSeries.push({name:"count",data:this.columnChartSeriesdata})

      this.getIntentCountAndName()
      this.columnChartSeries2.push({name:"count",data:this.itentCount})
      this.sessionss =  res.statistics.sessions
      this.userss =  res.statistics.users
      this.generateArrayDateUserSession()

     // this.areaChartSeries.push({name:"sessions",data:[this.sessionArray]},{name:"users",data:[this.userArray]})
      this.areaChartSeries.push({name:"sessions",data:this.sessionss},{name:"users",data:this.userss})
      console.log("sessions,",this.sessionss)
      console.log("users,",this.userss)
      console.log("zzzzzzzzzzzzzzzzzz,",this.areaChartSeries)
      console.log("ddddddddddddddddd,",this.dateArray)
      this.setChartOptions()

      //this.areaChartSeries.push({name:"sessions",data:[{x:this.dateArray,y:this.sessionss}]},{name:"users",data:[{x:this.dateArray,y:this.userss}]});
    })
  }
  divideDateRng(){

      let date:Date = new Date(this.filter.startDate)

      while( date < new Date(this.filter.endDate)){
        let newdate =new Date(date);
        //const datestring = moment(newdate).format('D MMMM YYYY');

       // this.dateArray.push(datestring)
        this.dateArray.push(newdate.toISOString())
        date.setDate((date.getDate()+1))
      }
      console.log("ahjuch",this.dateArray)

  }

  setChartOptions(){
    this.chartOptions = {
      series: [],
      chart: {
        width: 380,
        type: "pie"
      },
      labels: ["Success","Failuue"],
      colors: ['#67CA15', '#F95C54'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };

    this.chartOptionsArea = {
      series: [] ,
      chart: {
        height: 350,
        type: "area"
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },
      xaxis: {
        type: "datetime",
        categories: []
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm"
        }
      }
    };
    this.chartOptionsArea.xaxis.categories = this.dateArray

    this.chartOptionsColumn = {
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
        "#546E7A",
        "#D10CE8"
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
        categories: ["web","mobile","whatsapp","twitter","faceBook","telegram", "agents"],
        labels: {
          style: {
            colors: [
              "#008FFB",
              "#00E396",
              "#FEB019",
              "#FF4560",
              "#775DD0",
              "#546E7A",
              "#26a69a"
            ],
            fontSize: "12px"
          }
        }
      }
    };
    this.chartOptionsColumn2 = {
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
        "#546E7A",
        "#D10CE8"
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
              "#775DD0",
              "#546E7A",
              "#26a69a"
            ],
            fontSize: "12px"
          }
        }
      }
    };
    this.chartOptionsColumn2.xaxis.categories = []
    this.getIntentName()

    this.chartOptionsColumn2.xaxis.categories = this.listOfRealNameIntent

  }

  generateArrayDateUserSession(){
    for (let index = 0; index < this.sessionss.length; index++) {
      this.userArray.push([this.dateArray[index],this.userss[index]])
      this.sessionArray.push([this.dateArray[index],this.sessionss[index]])
    }
    console.log("userssss", this.userArray)
    console.log("sessionsss", this.sessionArray)
  }


  getIntentCountAndName(){
    for (let index = 0; index < this.intents.length; index++) {
      this.itentCount.push(this.intents[index].count)
      this.intentsId.push(this.intents[index].intent)
    }
    console.log("intentcount",this.itentCount)
    console.log("intentname",this.intentsId)
  }

  getIntents(){
    this._analyticalService.GetIntents(this.filter).subscribe((res:any[])=>{
      if(res){
        this.listOfIntent =res
        console.log("listOfintents",this.listOfIntent)
      }
    })
  }
  getUnderstandingIntent(){
    this._analyticalService.GetUnderstanding(this.filter).subscribe((res:any[])=>{
      if(res){
        this.listOfUnderStandIntent = res
        console.log("listOfUnderstandingintents",this.listOfUnderStandIntent)
      }
    })
  }
  getIntentName(){
    let x ;
    let y ;
    for (let index = 0; index < this.intentsId.length; index++) {
      y = this.listOfIntent.find(a=>a.intentId == this.intentsId[index])
     if(y){
      this.listOfRealNameIntent.push(y.intent)
     }
     else{
       x = this.listOfUnderStandIntent.find(a=>a.intentId == this.intentsId[index])
       if(x){
         this.listOfRealNameIntent.push(x.description)
       }
       else{
         this.listOfRealNameIntent.push(this.intentsId[index])
       }
     }
   }
   console.log("realnameintent",this.listOfRealNameIntent)
  }
  // getIntentName(){
  //   this._analyticalService.GetIntents(this.filter).subscribe((res:any[])=>{
  //      this.listOfIntent =res
  //      console.log(this.listOfIntent)
  //
  //      this._analyticalService.GetUnderstanding(this.filter).subscribe((res:any[])=>{
  //       this.listOfUnderStandIntent = res
  //       let x ;
  //       let y ;
  //       console.log(this.listOfUnderStandIntent)
  //       for (let index = 0; index < this.intentsId.length; index++) {
  //          x = this.listOfUnderStandIntent.find(a=>a.intentId == this.intentsId[index])
  //         if(x){
  //               this.listOfRealNameIntent.push(x.description)
  //         }
  //         else{
  //           y = this.listOfIntent.find(a=>a.intentId == this.intentsId[index])
  //           if(y){
  //             this.listOfRealNameIntent.push(y.intent)
  //           }
  //           else{
  //             this.listOfRealNameIntent.push(this.intentsId[index])
  //           }
  //         }

  //       }
  //       console.log("realnameintent",this.listOfRealNameIntent)

  //    })
  //   })
  // }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
    clearTimeout(this.updateTimer1);
    clearTimeout(this.updateTimer2);
    clearTimeout(this.updateTimer3);
  }

}

