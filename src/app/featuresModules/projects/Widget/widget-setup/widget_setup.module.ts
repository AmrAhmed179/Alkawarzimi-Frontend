import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { FormsModule } from "@angular/forms";
import { widgetSetuptRoutingModule } from "./widget_setup-routing.module";


@NgModule({
  imports: [CommonModule, SharedModule, FormsModule, widgetSetuptRoutingModule],
  declarations: [

  ],
})
export class Widget_setupModule {}
