//import { TransModule } from 'src/app/shared/trans.module';

import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatMenuModule } from "@angular/material/menu";
import { MatDividerModule } from "@angular/material/divider";
import { ProjectCreateUpdateComponent } from "./project-create-update.component";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { NgSelectModule } from "@ng-select/ng-select";
import { TransModule } from "src/app/shared/trans.module";
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatSelectModule,
    MatMenuModule,

    MatDividerModule,
    MatCheckboxModule,
    MatDatepickerModule,
    NgSelectModule,
    TransModule,
  ],
  declarations: [ProjectCreateUpdateComponent],
  exports: [ProjectCreateUpdateComponent],
})
export class ProjectCreateUpdateModule {}
