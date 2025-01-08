import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
// import{ChartComponent}from '../../../@vex/components/chart/chart.component';

// import { ApexOptions } from '../../../@vex/components/chart/chart.component';
import { defaultChartOptions } from "src/@vex/utils/default-chart-options";
import { createDateArray } from "src/@vex/utils/create-date-array";
import { ApexOptions } from "src/@vex/components/chart/chart.component";
import { asapScheduler } from "rxjs";

@Component({
  selector: "app-charts",
  templateUrl: "./charts.component.html",
  styleUrls: ["./charts.component.css"],
})
export class ChartsComponent implements OnInit {
  @Input() title: string;
  options: ApexOptions;
  // @Input()numberDate  ;
  private nubers: number;

  @Input() set datecharts(n: any) {
    console.log("dffffffffff" + n);
    this.options = defaultChartOptions({
      grid: {
        show: true,
        strokeDashArray: 3,
        padding: {
          left: 16,
        },
      },
      chart: {
        type: "area",
        height: 384,
        sparkline: {
          enabled: false,
        },
        zoom: {
          enabled: false,
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 0.9,
          opacityFrom: 0.7,
          opacityTo: 0.5,
          stops: [0, 90, 100],
        },
      },
      colors: ["#008ffb", "#ff9800"],
      labels: n,
      xaxis: {
        type: "datetime",
        labels: {
          show: true,
        },
      },
      yaxis: {
        labels: {
          show: true,
        },
      },
      legend: {
        show: true,
        itemMargin: {
          horizontal: 4,
          vertical: 4,
        },
      },
    });
  }
  // @Input() set numberdate(n: number) {
  //   console.log("dffffffffff" +n)
  //   this.options = defaultChartOptions({
  //     grid: {
  //       show: true,
  //       strokeDashArray: 3,
  //       padding: {
  //         left: 16
  //       }
  //     },
  //     chart: {
  //       type: 'area',
  //       height: 384,
  //       sparkline: {
  //         enabled: false
  //       },
  //       zoom: {
  //         enabled: false
  //       }
  //     },
  //     fill: {
  //       type: 'gradient',
  //       gradient: {
  //         shadeIntensity: 0.9,
  //         opacityFrom: 0.7,
  //         opacityTo: 0.5,
  //         stops: [0, 90, 100]
  //       }
  //     },
  //     colors: ['#008ffb', '#ff9800'],
  //     labels:createDateArray(n),
  //     xaxis: {
  //       type: 'datetime',
  //       labels: {
  //         show: true
  //       },
  //     },
  //     yaxis: {
  //       labels: {
  //         show: true
  //       }
  //     },
  //     legend: {
  //       show: true,
  //       itemMargin: {
  //         horizontal: 4,
  //         vertical: 4
  //       }
  //     }
  //   });
  // }

  @Input() series: ApexNonAxisChartSeries | ApexAxisChartSeries;
  // @Input() options: ApexOptions = defaultChartOptions({
  //   grid: {
  //     show: true,
  //     strokeDashArray: 3,
  //     padding: {
  //       left: 16
  //     }
  //   },
  //   chart: {
  //     type: 'area',
  //     height: 384,
  //     sparkline: {
  //       enabled: false
  //     },
  //     zoom: {
  //       enabled: false
  //     }
  //   },
  //   fill: {
  //     type: 'gradient',
  //     gradient: {
  //       shadeIntensity: 0.9,
  //       opacityFrom: 0.7,
  //       opacityTo: 0.5,
  //       stops: [0, 90, 100]
  //     }
  //   },
  //   colors: ['#008ffb', '#ff9800'],
  //   labels:createDateArray(this.numberdate),
  //   xaxis: {
  //     type: 'datetime',
  //     labels: {
  //       show: true
  //     },
  //   },
  //   yaxis: {
  //     labels: {
  //       show: true
  //     }
  //   },
  //   legend: {
  //     show: true,
  //     itemMargin: {
  //       horizontal: 4,
  //       vertical: 4
  //     }
  //   }
  // });

  constructor(private cd: ChangeDetectorRef, private ngZone: NgZone) {}

  ngOnInit() {
    console.log("aaaaaaaaaaaaa" + JSON.stringify(this.nubers));

    console.log("aaaaaaaaaaaaa" + JSON.stringify(this.series));
  }
}
