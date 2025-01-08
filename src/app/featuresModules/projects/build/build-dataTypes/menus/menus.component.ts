import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { MenusService } from 'src/app/Services/Build/menus.service';
import { ProjectModel } from 'src/app/core/models/project-model';
import { DataService } from 'src/app/core/services/data.service';
import { NotifyService } from 'src/app/core/services/notify.service';
import { MagicWordWriteComponent } from 'src/app/shared/components/magic-word-write/magic-word-write.component';
import { MenusCreateComponent } from './menus-create/menus-create.component';
import { ServicesSetService } from 'src/app/Services/Build/services-set.service';
import { Router } from '@angular/router';

interface ServiceDataObject {
  ObjectID: string;
  Required: boolean;
  Knowledege: boolean;
  dispaly: boolean;
  resetAfterUsage: boolean;
  password: null;
}

interface OutputMappingObject {
  variableId: string;
  jsonField: string;
}

interface ServiceDetail {
  servicesId: number;
  name: string;
  url: string | null;
  userName: null;
  password: null;
  login: boolean;
  mainApi: boolean;
  dynamicMenuLoader: boolean;
  liveChatService: boolean;
  serviceData: ServiceDataObject[] | null;
  executionConfimation: boolean;
  messages: Message[];
  outputMapping: OutputMappingObject[] | null;
}

interface Message {
  confirmation: null;
  refuseMessage: null;
  uncompletedObjects: null;
  language: string;
}


@Component({
  selector: 'vex-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.scss']
})
export class MenusComponent implements OnInit {

  projectId: number;
  menuName: string;
  menus: any[] = [];
  private projectSubscription: Subscription;
  displayedColumns: string[] = ['name', 'type', 'action'];
  dataSource = new MatTableDataSource<any>();
  menuId: any;
  services: any;
  serviceInfo;


  constructor(
    private _menuService: MenusService,
    private _dataService: DataService,
    public dialog: MatDialog,
    private notify: NotifyService,
    private _services: ServicesSetService,
    private router: Router,

  ) { }

  ngOnInit(): void {
    this.projectSubscription = this._dataService.$project_bs.subscribe((project: ProjectModel) => {
      this.projectId = +project._id;
      this.getSystemMenu();
      this.getServices();
    });
  }

  ngOnDestroy(): void {
    if (this.projectSubscription) {
      this.projectSubscription.unsubscribe();
    }
  }

  async getSystemMenu() {
    try {
      const response: any = await this._menuService.GetMenus(this.projectId).toPromise();

      if (response && response.menus) {
        this.menus = response.menus;
        let entitiesArray = [];

        this.menus.forEach(menu => {
          this.menuName = menu.name;
          this.menuId = menu.menuId;
          let entityObj = {
            name: menu.name,
            type: menu.type,
            menuId: menu.menuId
          };
          entitiesArray.push(entityObj);

        });

        this.dataSource.data = entitiesArray;
        console.log(JSON.stringify(this.dataSource.data))

      } else {
        console.warn("Invalid or no response from the server");
      }
    } catch (error) {
      console.error("Error fetching menus:", error);
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getServices() {
    this._services.GetServices(this.projectId).subscribe((response) => {
      if (response && response["services"]) {
        this.services = response["services"];

        this.serviceInfo = [];
        this.services.forEach((service: ServiceDetail) => {
          const serviceName: string = service.name;
          const serviceId: number = service.servicesId;
          const serviceInfoObject = { name: serviceName, id: serviceId };

          this.serviceInfo.push(serviceInfoObject);
        });

      }
    });
  }

  deleteMenu() {
    const QuestionTitle = 'Are you sure you want to delete this Menu?';
    const pleasWriteMagic = 'Please write the **Magic** word to delete';
    const actionName = 'delete';

    this.dialog.open(MagicWordWriteComponent, {
      data: {
        QuestionTitle: QuestionTitle,
        pleasWriteMagic: pleasWriteMagic,
        actionName: actionName,
        item: this.menuId
      },
      height: '20$', width: '40%',
    })
      .afterClosed()
      .subscribe(response => {
        if (response) {
          this._menuService.DeleteMenu(this.projectId, this.menuId).subscribe(response => {
            if (response && response["status"] == 1) {
              this.notify.openSuccessSnackBar("This Menu Successfully Deleted");
              this.getSystemMenu();
            } else {
              this.notify.openFailureSnackBar(response ? response["message"] : "Failed to delete menu");
            }
          });
        }
      });
  }

  CreateMenu() {
    const actionName = 'create';
    this.dialog.open(MenusCreateComponent, {
      data: { projectId: this.projectId, serviceInfo: this.serviceInfo },
      height: '20$', width: '40%'
    })
      .afterClosed()
      .subscribe((response) => {
        if (response) {

          let payload = {
            projectId: this.projectId,
            menu: {
              name: response.menu,
              type: response.type,
              serviceId: response.serviceId
            },
          }

          this._menuService.CreateMenu(payload).subscribe(response => {
            if (response) {
              if (response["status"] == 1) {
                this.notify.openSuccessSnackBar("Entity Successfully Created");
              } else {
                this.notify.openFailureSnackBar(response ? response["message"] : "Failed to create entity");
              }
            }
          });
        }
      });
  }

  navigateToClassInfo(menuId) {
    debugger
    this.router.navigate([`/projects/${this.projectId}/menuEdit/${menuId}`]);
  }

}




