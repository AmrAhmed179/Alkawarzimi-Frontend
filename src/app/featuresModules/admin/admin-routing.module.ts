import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CustomLayoutComponent } from "src/app/shared/custom-layout/custom-layout.component";
import { AdminComponent } from "./admin.component";
import { AddBotDeveloperComponent } from "./pages/add-bot-developer/add-bot-developer.component";
import { AllBotDevelopersComponent } from "./pages/all-bot-developers/all-bot-developers.component";
import { AllCompaniesComponent } from "./pages/all-companies/all-companies.component";
import { AttachBotDeveloperToProjectComponent } from "./pages/attach-bot-developer-to-project/attach-bot-developer-to-project.component";
import { ClientsPage } from "./pages/clients/clients.page";
import { CompanyDetailsComponent } from "./pages/company-details/company-details.component";
import { CreateCompanyComponent } from "./pages/create-company/create-company.component";
import { CreateTemplateComponent } from "./pages/create-template/create-template.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { DeleteProjectComponent } from "./pages/delete-project/delete-project.component";
import { HomePage } from "./pages/home/home.page";
import { UpdateDomainDataComponent } from "./pages/update-domain-data/update-domain-data.component";
import { UserProfileComponent } from "./pages/user-profile/user-profile.component";
import { AIModelsComponent } from "./pages/aimodels/aimodels.component";

const routes: Routes = [
  { path: "", redirectTo: "dashboard", pathMatch: "full"},
  {
    path: "",
    component: AdminComponent,
    children: [
      {
        path: "",
        component: CustomLayoutComponent,
        data: {
          adminMode: true,
        },
        children: [
          { path: "userprofile", component: UserProfileComponent },
          { path: "dashboard", component: DashboardComponent ,data: { breadcrumbs: [],}},
          { path: "clients", component: ClientsPage },
          { path: "allBotDeveloper", component: AllBotDevelopersComponent },
          { path: "addBotDeveloper", component: AddBotDeveloperComponent },
          { path: "addchBotDeveloperToProject", component: AttachBotDeveloperToProjectComponent },
          { path: "deleteproject", component: DeleteProjectComponent },
          { path: "updatedomaindata", component: UpdateDomainDataComponent },
          { path: "createtemplate", component: CreateTemplateComponent },
          { path: "allcompanies", component: AllCompaniesComponent,
          children:[
          ] },
          { path: "createcompanies", component: CreateCompanyComponent },
          { path: "allcompanies/:id", component: CompanyDetailsComponent },
          { path: "AIModels", component: AIModelsComponent },



        ],
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
