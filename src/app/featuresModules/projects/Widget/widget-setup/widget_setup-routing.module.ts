import { RouterModule, Routes } from "@angular/router";
import { WidgetSetupComponent } from "./widget-setup.component";
import { NgModule } from "@angular/core";

const routes: Routes = [{ path: "", component: WidgetSetupComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class widgetSetuptRoutingModule {}
