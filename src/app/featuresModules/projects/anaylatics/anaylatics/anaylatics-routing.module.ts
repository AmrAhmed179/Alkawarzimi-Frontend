import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomLayoutComponent } from 'src/app/shared/custom-layout/custom-layout.component';
import { AnaylaticsOverviewComponent } from './analytic-components/anaylatics-overview/anaylatics-overview.component';

const routes: Routes = [
  // { path: "", redirectTo: "overview", pathMatch: "full"},

  //     {
  //       path: "",
  //       component: CustomLayoutComponent,
  //       data: {
  //         adminMode: true,
  //       },
  //       children: [
  //         { path: "overview", component: AnaylaticsOverviewComponent },

  //       ],
  //     },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnaylaticsRoutingModule { }
