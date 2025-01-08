import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ChartsUserComponent } from "./chartsUser.component";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { ChartModule } from "src/@vex/components/chart/chart.module";
import { MaterialModule } from "../../material.module";

@NgModule({
  imports: [CommonModule, MatIconModule, MatButtonModule, ChartModule],
  declarations: [ChartsUserComponent],
  exports: [ChartsUserComponent],
})
export class ChartsUserModule {}
