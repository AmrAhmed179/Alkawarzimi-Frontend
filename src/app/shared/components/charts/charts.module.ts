import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsComponent } from './charts.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ChartModule } from 'src/@vex/components/chart/chart.module';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    ChartModule
  ],
  declarations: [ChartsComponent],
  exports: [ChartsComponent]

})
export class ChartsModule { }
