import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./core/guards/auth.guard";
import { Error401Component } from "./shared/errors/error401/error401.component";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    canActivate: [AuthGuard],
    data: {
      role: ["_"],
    },
  },
  { path: "error-401", component: Error401Component },
  {
    path: "admin",
    loadChildren: () =>
      import("./featuresModules/admin/admin.module").then((m) => m.AdminModule),
  //  canActivate: [AuthGuard],
    // data: {
    //   role:  ["Admin","System Admin","System User"]
    // },
  },
  {
    path: "projects",
    loadChildren: () =>
      import("./featuresModules/projects/projects.module").then(
        (m) => m.ProjectsModule
      ),
  },
  // {
  //   path: "anaylatics",
  //   loadChildren: () =>
  //     import("./featuresModules/projects/anaylatics/anaylatics/anaylatics.module").then(
  //       (m) => m.AnaylaticsModule
  //     ),
  // },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // preloadingStrategy: PreloadAllModules,
      scrollPositionRestoration: "enabled",
      relativeLinkResolution: "corrected",
      anchorScrolling: "enabled",
      useHash: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
