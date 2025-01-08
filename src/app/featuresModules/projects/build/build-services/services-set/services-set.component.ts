import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { ServicesSetService } from 'src/app/Services/Build/services-set.service';
import { ServicesModel } from 'src/app/core/models/Services';
import { ServicesCreateComponent } from '../services-create/services-create.component';
import { ContextVariableModel } from 'src/app/core/models/contextVariable';
import { NotifyService } from 'src/app/core/services/notify.service';
import { MagicWordWriteComponent } from 'src/app/shared/components/magic-word-write/magic-word-write.component';
import { ContextVariableService } from 'src/app/Services/Build/context-variable.service';

@Component({
  selector: 'vex-services-set',
  templateUrl: './services-set.component.html',
  styleUrls: ['./services-set.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ]
})
export class ServicesSetComponent implements OnInit {

  chatBotId: number;
  services: ServicesModel[] = []
  dataSource: MatTableDataSource<ServicesModel>;
  displayedColumns: string[] = ['name', 'url', 'userName', 'password', 'actions'];

  constructor(
    private _services: ServicesSetService,
    private _contextVariableService: ContextVariableService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private notify: NotifyService
  ) { }

  ngOnInit(): void {
    this.route.parent.params.subscribe((parmas: Params) => {
      this.chatBotId = parmas["projectid"];
      this.getServices();
    })
  }

  getServices() {
    this._services.GetServices(this.chatBotId).subscribe((response) => {
      if (response) {
        this.services = response["services"];
        this.dataSource = new MatTableDataSource(this.services);
      }

    })
  }

  applyFilter(event: Event) {

    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  deleteService(service: ServicesModel) {
    const QuestionTitle = 'Are you sure you want to delete this Service?';
    const pleasWriteMagic = 'Please write the **Magic** word to delete';
    const actionName = 'delete';

    this.dialog.open(MagicWordWriteComponent, {
      data: {
        QuestionTitle: QuestionTitle, pleasWriteMagic: pleasWriteMagic, actionName: actionName, item: service.servicesId
      },
      maxHeight: '760px',
      width: '600px',
      position: { top: '100px', left: '400px' }
    },
    )
      .afterClosed()
      .subscribe(response => {
        if (response) {
          this._services.DeleteServices(service.servicesId, this.chatBotId).subscribe(response => {
            if (response) {
              if (response["status"] == 1) {
                this._contextVariableService.DeleteServicesContext(service.servicesId.toString(), this.chatBotId).subscribe(re => {
                  if (re) {
                    if (re["status"] == 1) {
                      this.notify.openSuccessSnackBar("This Entity Successfully Deleted");
                      this.getServices();
                    }
                    else {
                      this.notify.openFailureSnackBar(response["Message"])
                    }
                  }
                })
              }
              else {
                this.notify.openFailureSnackBar(response["message"])
              }
            }
          })
        }
      })

  }

  CreateService() {
    const servName = this.services.map(e => e.name)
    this.dialog.open(ServicesCreateComponent, { data: { servicesName: servName, chatBotId: this.chatBotId }, height: '40%', width: '40%' })
      .afterClosed().subscribe((response: ServicesModel) => {
        if (response) {
          this._services.CreateServices(response, this.chatBotId).subscribe(resp => {
            if (resp) {
              debugger
              if (resp["status"] == 1) {
                let serviceId: string = resp["services"]["servicesId"].toString();
                let serviceName: string = resp["services"]["name"];
                let v_Status: ContextVariableModel = {
                  contextVariableId: '',
                  key: serviceName + '_status',
                  intentId: null,
                  name: null,
                  value: null,
                  type: "sys.boalean",
                  dataType: "sys",
                  validationSubType: "0",
                  list: false,
                  sysVariable: false,
                  sourceBot: null,
                  servicesId: serviceId,
                  sysVariabletype: 0,
                  displayFields: null,
                }

                this._contextVariableService.CreateContextVariable(v_Status, this.chatBotId).subscribe(respons => {
                  if (respons) {
                    debugger
                    let v_Return: ContextVariableModel = {
                      contextVariableId: '',
                      key: serviceName + '_return',
                      intentId: null,
                      name: null,
                      value: null,
                      type: "string",
                      dataType: "sys",
                      validationSubType: "0",
                      list: false,
                      sysVariable: false,
                      sourceBot: null,
                      servicesId: serviceId,
                      sysVariabletype: 0,
                      displayFields: null,
                    }
                    this._contextVariableService.CreateContextVariable(v_Return, this.chatBotId).subscribe(respon => {
                      if (respon) {
                        debugger
                        if (respon["status"] == 1) {

                          this.notify.openSuccessSnackBar("This Servic Successfuly Created")
                          this.router.navigate(['./', serviceId], { relativeTo: this.route })
                        }
                        else {
                          this.notify.openFailureSnackBar(respon["Exception"])
                        }
                      }
                    })
                  }

                })

              }
              else {
                this.notify.openFailureSnackBar(resp["message"])
              }
            }
          })
        }

      });
  }


}
