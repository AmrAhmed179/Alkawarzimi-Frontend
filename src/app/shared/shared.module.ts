import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SpinnerComponent } from "./components/spinner/spinner.component";
import { OrderCardComponent } from "./components/widgets/order-card/order-card.component";
import { ChartsModule } from "./components/charts/charts.module";
import { ChartsUserModule } from "./components/chartsUser/chartsUser.module";
import { MaterialModule } from "./material.module";
import { Error401Component } from "./errors/error401/error401.component";
import { TransModule } from "./trans.module";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { ReactiveFormsModule } from "@angular/forms";
import { WidgetQuickValueCenterModule } from "src/@vex/components/widgets/widget-quick-value-center/widget-quick-value-center.module";
import { ChartModule } from "src/@vex/components/chart/chart.module";

@NgModule({
  declarations: [SpinnerComponent, OrderCardComponent, Error401Component],
  imports: [
    CommonModule,
    ChartsModule,
    ChartsUserModule,
    MaterialModule,
    RouterModule,
    TransModule,
    ReactiveFormsModule,
    ChartModule
  ],
  exports: [
    Error401Component,

    SpinnerComponent,
    OrderCardComponent,
    ChartsModule,
    ChartsUserModule,
    MaterialModule,
    //TransModule,
    TranslateModule,
    ReactiveFormsModule,
    WidgetQuickValueCenterModule,
    ChartModule

  ],
})
export class SharedModule {}
