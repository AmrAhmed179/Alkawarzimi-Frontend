import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { HomePage } from './pages/home/home.page';
import { ClientsPage } from './pages/clients/clients.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AllBotDevelopersComponent } from './pages/all-bot-developers/all-bot-developers.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { AddBotDeveloperComponent } from './pages/add-bot-developer/add-bot-developer.component';
import { AttachBotDeveloperToProjectComponent } from './pages/attach-bot-developer-to-project/attach-bot-developer-to-project.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeleteProjectComponent } from './pages/delete-project/delete-project.component';
import { UpdateDomainDataComponent } from './pages/update-domain-data/update-domain-data.component';
import { CreateTemplateComponent } from './pages/create-template/create-template.component';
import { DialogCreateTemplateComponent } from './pages/dialog-create-template/dialog-create-template.component';
import { AllCompaniesComponent } from './pages/all-companies/all-companies.component';
import { CreateCompanyComponent } from './pages/create-company/create-company.component';
import { EditCompanyComponent } from './pages/edit-company/edit-company.component';
import { CompanyDetailsComponent } from './pages/company-details/company-details.component';
import { DialogEditUserComponent } from './pages/dialog-edit-user/dialog-edit-user.component';


@NgModule({
  declarations: [
    AdminComponent,
    HomePage,
    ClientsPage,
    DashboardComponent,
    AllBotDevelopersComponent,
    UserProfileComponent,
    AddBotDeveloperComponent,
    AttachBotDeveloperToProjectComponent,
    DeleteProjectComponent,
    UpdateDomainDataComponent,
    CreateTemplateComponent,
    DialogCreateTemplateComponent,
    AllCompaniesComponent,
    CreateCompanyComponent,
    EditCompanyComponent,
    CompanyDetailsComponent,
    DialogEditUserComponent,

  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    TranslateModule,
    ReactiveFormsModule

  ]
})
export class AdminModule { }
