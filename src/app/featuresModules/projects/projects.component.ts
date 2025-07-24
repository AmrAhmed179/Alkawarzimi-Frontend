import { Component, ElementRef, HostListener, Inject, OnInit, Renderer2 } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import moment from "moment";
import { filter, map, Observable } from "rxjs";
import { ColorSchemeName } from "src/@vex/config/colorSchemeName";
import { ConfigService } from "src/@vex/config/config.service";
import { NavigationService } from "src/@vex/services/navigation.service";
import { ProjectModel } from "src/app/core/models/project-model";
import { UserModel } from "src/app/core/models/user-model";
import { DataService } from "src/app/core/services/data.service";
import { NotifyService } from "src/app/core/services/notify.service";
import { ProjectService } from "src/app/core/services/project.service";
import { DeleteComponent } from "src/app/shared/item-delete-model/delete.component";
import { environment } from "src/environments/environment";
import { ProjectCreateUpdateComponent } from "./components/project-create-update/project-create-update.component";
import { DashboardService } from "src/app/Services/dashboard.service";
import { AnalyticServiceService } from "src/app/Services/analytic-service.service";
import { filterAnalytical } from "src/app/core/models/filterAnaylic";
import { OptionsServiceService } from "src/app/Services/options-service.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import {  ProjectDetailsModel } from "src/app/core/models/project-details";
import { MagicWordWriteComponent } from "src/app/shared/components/magic-word-write/magic-word-write.component";
import { DOCUMENT } from "@angular/common";
import { CreateWorkSpaceComponent } from "./components/create-work-space/create-work-space.component";


@Component({
  selector: "vex-projects",
  templateUrl: "./projects.component.html",
  styleUrls: ["./projects.component.scss"],
})
export class ProjectsComponent implements OnInit {
  code:string = "";
  showButton=false;
  projectS:any
  searchText: string = '';
  filteredProjects: any[] = [];
  showDetailsClass:boolean = false
  showEditClass:boolean = false
  projectname:any
  projectEditForm:FormGroup
  colorScheme=ColorSchemeName.default;
    projectss =[{_id:"150",name:"project-150"},{_id:"2",name:"project-2"},{_id:"3",name:"project-3"},{_id:"4",name:"project-5"},{_id:"1",name:"project-6"}]
  user: UserModel;
  projects: ProjectModel[];
  OwnerText = "owner";
  categoryIndex: any = -1;
  direction$ = this.configService.config$.pipe(
    map((config) => config.direction)
  );
  isVerticalLayout$: Observable<boolean> = this.configService.config$.pipe(
    map((config) => config.layout === "vertical")
  );
  userVisible$: Observable<boolean> = this.configService.config$.pipe(
    map((config) => config.toolbar.user.visible)
  );
  icon = "ksa";
  switchLang(lang: string) {
    if (lang == "ar") {
      this.icon = "ksa";
      this.configService.updateConfig({
        direction: "rtl",
      });
    } else {
      this.icon = "united-states";
      this.configService.updateConfig({
        direction: "ltr",
      });
    }
  }
  constructor(
    private configService: ConfigService,
    private element: ElementRef,
    private dialog: MatDialog,
    private _dataSerivce: DataService,
    private _projectService: ProjectService,
    private router: Router,
    private notify: NotifyService,
    private navigationService: NavigationService,
    private dashboardService: DashboardService,
    private _analyticalService:AnalyticServiceService,
    private _optionsService:OptionsServiceService,
    private fb:FormBuilder,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2

  ) {

    configService.updateConfig({
      style: {
        colorScheme:this.colorScheme
      }
    });
  }
  result: string;

  today: number = Date.now();
  IMG_PATH_URL;
  project_types = [];

  ngOnInit() {
    this.code = `(function (w, d, s, o, f, js, fjs) {
      w['alkawarizmi'] = o; w[o] = w[o] || function () { (w[o].q = w[o].q || []).push(arguments) };
      js = d.createElement(s), fjs = d.getElementsByTagName(s)[0];
      js.id = o; js.src = f; js.async = 1; fjs.parentNode.insertBefore(js, fjs);
  }(window, document, 'script', 'myBbot', 'https://orchestrator.alkhwarizmi.xyz/plugins/alkhwarizmi.sdk.1.1.0.js'));
  myBbot('init', { id: 296, title: "", draggable: true, animatedIcon: 1 });`
    // this.getProjects()
    this.getAllProjects()
    this.IMG_PATH_URL = environment.URLS.IMG_PATH;
    this.getLoggedUser();

    this.direction$.subscribe((dir) => {
      this.icon = dir === "rtl" ? "ksa" : "united-states";
    });

    ///this.GetCategories();
    // this.getProjectsAndSaveInStorage();
    // this.AskForAllowNotification();
  }
  getLoggedUser() {
    this._dataSerivce.$user_bs.subscribe((user) => {
      console.log("USER GET IN PROJECT COMP ", user);
      this.user = user;
      if (this.user != null)
        this.getProjectsAndSaveInStorage();
    });
  }

  getProjectName(name){
    debugger
    this._analyticalService.proJectName$.next(name);
  }
  openDashboard(){
    window.open('/Dashboard', '_blank');
  }
  myAvailabilityCount: number;
  /**
   * GET PROJECTS AND SAVE IN THE STORAGE: PROJECT ID - PROJECT NAME - USE ROLE   */
  showSpinner = true;
  getProjectsAndSaveInStorage() {
    this._projectService.getProjects(this.user.id).subscribe(
      (response) => {
        debugger;

        let projects: ProjectModel[];
        projects = response["output"]["result"];

        console.log("!!! GET PROJECTS ", projects);
        this.showSpinner = false;
        if (projects) {
          this.projects = projects;
          // SET THE IDs and the NAMES OF THE PROJECT IN THE LOCAL STORAGE.
          // WHEN IS REFRESHED A PAGE THE AUTSERVICE USE THE NAVIGATION PROJECT ID TO GET FROM STORAGE THE NAME OF THE PROJECT
          // AND THEN PUBLISH PROJECT ID AND PROJECT NAME
          let countOfcurrentUserAvailabilityInProjects = 0;

          this.projects.forEach((project) => {
            console.log(project.updatedAt);
            project.updatedAt = moment(project.updatedAt);
            project.createdAt = moment(project.createdAt);
            // project.id_project['createdAt'] =moment(project.id_project['createdAt'])
            //project.id_project['updatedAt'] =moment(project.id_project['updatedAt'])
            console.log("!!! SET PROJECT IN STORAGE" + JSON.stringify(project));
            /***  ADDED TO KNOW IF THE CURRENT USER IS AVAILABLE IN SOME PROJECT
             *    ID USED TO DISPLAY OR NOT THE MSG 'Attention, if you don't want to receive requests...' IN THE LOGOUT MODAL  ***/
            if (project.user_available === true) {
              countOfcurrentUserAvailabilityInProjects =
                countOfcurrentUserAvailabilityInProjects + 1;
            }
            localStorage.setItem(project._id, JSON.stringify(project));
          });

          this.myAvailabilityCount = countOfcurrentUserAvailabilityInProjects;

          this._projectService.countOfMyAvailability(this.myAvailabilityCount);
          console.log(
            "!!! GET PROJECTS - I AM AVAILABLE IN # ",
            this.myAvailabilityCount,
            "PROJECTS"
          );
        }
      },
      (error) => {
        this.showSpinner = false;
        console.log("GET PROJECTS - ERROR ", error);
      },
      () => {
        console.log("GET PROJECTS - COMPLETE");
      }
    );
  }

  createProject(
    name: string,
    templateId: string,
    categoryname: string,
    userId: string
  ) {
    this._projectService.addProject(name, userId).subscribe(
      (project: any) => {
        debugger;

        this.notify.openSuccessSnackBar("تم اضافة المشروع بنجاح");
        this.getProjectsAndSaveInStorage();
        this.openProject(project["output"]["project"]);
      },
      (error) => {
        this.notify.openFailureSnackBar("هناك خطا في إضافة المشروع .");
      },
      () => {}
    );
  }
  chatbotId;
  openCreateModel() {
    this.dialog
      .open(ProjectCreateUpdateComponent, {
        data: {
          mode: "create",
          item: null,
        },
      })
      .afterClosed()
      .subscribe((project: any) => {
        if (project) {
          debugger;
          this.createProject(
            project.name,
            project.chatbotId,

            project.categroy.category,
            this.user.id
          );
        }
      });
  }
  openEditModel(project: ProjectModel) {
    this.dialog
      .open(ProjectCreateUpdateComponent, {
        data: {
          mode: "update",
          item: project,
        },
      })
      .afterClosed()
      .subscribe((updatedProject) => {
        /**
         * Customer is the updated customer (if the user pressed Save - otherwise it's null)
         */
        if (updatedProject) {
        }
      });
  }
  openDeleteModel(project: ProjectModel) {
    this.dialog
      .open(DeleteComponent, {
        data: {
          title: "حذف " + project.name,
          bodyText: "هل تريد حذف المشروع ؟",
          hints: [
            "ملحوظة : في حالة حذف المشروع سيتم حذف جميع البيانات الخاصة بالمشروع..",
          ],
          item: project,
        },
      })
      .afterClosed()
      .subscribe((deleteProject) => {
        if (deleteProject) {
          this.deleteProject(deleteProject._id);
        }
      });
  }
  deleteProject(projectId: string) {
    this._projectService.Ondeleteproject(projectId).subscribe((response) => {
      debugger;
      if (response["statusCode"] == 1) {
        this.notify.openSuccessSnackBar("تم حذف المشروع بنجاح .");
        this.getProjectsAndSaveInStorage();
      } else {
        this.notify.openFailureSnackBar("هناك خطا في تنفيذ العملية.");
      }
    });
  }

  // project/:projectid/home
  // , available: boolean
  openProject(project: ProjectModel) {
    this.router.navigate([`/projects/${project._id}/home`]);

    this._dataSerivce.projectSelected(project);
    console.log("!!! GO TO HOME - PROJECT ", project);
  }

  AskForAllowNotification() {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
      // If it's okay let's create a notification
      var notification = new Notification(
        "Welecome to Alkhawarizmi Live Chat ."
      );
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          var notification = new Notification(
            " Welecome to Alkhawarizmi Live Chat ."
          );
        }
      });
    }

    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them any more.
  }
  @HostListener('document:click', ["$event"])
  click(event,_id){
    var target = event?.target?.attributes.id || event?.srcElement?.attributes.id || event?.currentTarget?.attributes.id;
    var value = target?.nodeValue;
    if(value =='x'){
      event.stopPropagation();
    }
    if (value == 'y') {
      this.router.navigateByUrl('projects/'+ _id +'/home')
    }
  }

  // getProjects(){
  //   this.dashboardService.getProjects().subscribe(res=>{
  //     debugger
  //     this.projectS = res
  //     // let filter:filterAnalytical = new filterAnalytical()
  //     // this._analyticalService.filterAnylatic$.next(null)
  //   })
  // }

  getAllProjects(){
    debugger
    this._optionsService.getAllProjects().subscribe((res:any)=>{
      debugger
    this.projectS = res
    this.filterProjects();
    })
  }
  filterProjects() {
  this.filteredProjects = this.projectS.filter((project: any) =>
    project.name?.toLowerCase().includes(this.searchText.toLowerCase())
  );
}
  projectDetails(item){
    this.showDetailsClass = true
    this.projectname = item._id
  }
  EditProject(item){
    this.showEditClass = true
    this.projectname = item._id
    this.initiateForm(item)
  }
  initiateForm(item){
    this.projectEditForm = this.fb.group({
      name: [item.name],
      description: [''],
      facebook: [''],
      twitter: [''],
      language: [item.language],
    })
  }

  editProject(item){
    let x = this.projectEditForm.value
    let projectDetailsModel = new ProjectDetailsModel()
    projectDetailsModel.name=this.projectEditForm.controls['name'].value
    projectDetailsModel.description=this.projectEditForm.controls['description'].value
    projectDetailsModel.facebook=this.projectEditForm.controls['facebook'].value
    projectDetailsModel.twitter=this.projectEditForm.controls['twitter'].value
    projectDetailsModel.language=this.projectEditForm.controls['language'].value
    projectDetailsModel._id = item._id
    projectDetailsModel.updated = item.updated
    projectDetailsModel.intents = item.intents
    projectDetailsModel.entities = item.entities
    projectDetailsModel.edit = item.edit

    this._optionsService.EditProject(projectDetailsModel,item._id).subscribe(res=>{
      this.notify.openSuccessSnackBar('Project edited successfuly')
      this.getAllProjects()
    })
  }
  duplicateProject(project){
    const QuestionTitle = 'Are you sure you want to Duplicate this ?'
    const pleasWriteMagic = 'Please write the **Magic** word to Duplicate'
    const actionName = 'Duplicate'
    const item = project
    const dialogRef = this.dialog.open(MagicWordWriteComponent,{data:{QuestionTitle:QuestionTitle ,pleasWriteMagic:pleasWriteMagic ,actionName:actionName, item:item} ,maxHeight: '760px',
    width: '600px',
  position:{top:'100px',left:'400px'}},
    );
    dialogRef.afterClosed().subscribe(res=>{
      debugger
      if(res){
        this._optionsService.DuplicateProject(project._id).subscribe((res:any)=>{
          if(res.status === 1){
            this.notify.openSuccessSnackBar('project Duplicated Successfuly')
            this.getAllProjects()
          }
          else{
            this.notify.openFailureSnackBar('Faild to Duplicate')
          }
        })
      }
    })
  }
  DeleteProject(project){
    const QuestionTitle = 'Are you sure you want to delete this ?'
    const pleasWriteMagic = 'Please write the **Magic** word to delete'
    const actionName = 'delete'
    const item = project
    const dialogRef = this.dialog.open(MagicWordWriteComponent,{data:{QuestionTitle:QuestionTitle ,pleasWriteMagic:pleasWriteMagic ,actionName:actionName, item:item} ,maxHeight: '760px',
    width: '600px',
  position:{top:'100px',left:'400px'}},
    );
    dialogRef.afterClosed().subscribe(res=>{
      debugger
      if(res){
        this._optionsService.DeleteProject(project._id).subscribe((res:any)=>{
          if(res.status === 1){
            this.notify.openSuccessSnackBar('project Duplicated Successfuly')
            this.getAllProjects()
          }
          else{
            this.notify.openFailureSnackBar('Faild to Duplicate')
          }
        })
      }
    })
  }

  goToDashBoard(){
    this.router.navigateByUrl('admin')
  }

  logOut() {
    console.log("RUN LOGOUT FROM ToolBar");
    localStorage.removeItem("user");
    localStorage.removeItem("project");
    localStorage.removeItem("role");
    // localStorage.clear();
    this.document.location.href = environment.URLS.BASE_URL
  }
  createWorkSpace(){
    const dialogRef = this.dialog.open(CreateWorkSpaceComponent,{data:{} ,maxHeight: '760px',
    width: '1000px',
  },
    )
  }
}
