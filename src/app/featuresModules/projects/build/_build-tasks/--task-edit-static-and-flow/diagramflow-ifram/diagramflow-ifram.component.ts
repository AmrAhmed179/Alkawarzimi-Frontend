import { Component, ElementRef, Input, OnInit, Renderer2, HostListener  } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subject, takeUntil } from 'rxjs';
import { IntentSettings } from 'src/app/Models/build-model/intent-model';
import { TasksService } from 'src/app/Services/Build/tasks.service';
import { OptionsServiceService } from 'src/app/Services/options-service.service';
import { NotifyService } from 'src/app/core/services/notify.service';
import { CanComponentDeactivate } from './guards/unsaved-changes.guard';

@Component({
  selector: 'vex-diagramflow-ifram',
  templateUrl: './diagramflow-ifram.component.html',
  styleUrls: ['./diagramflow-ifram.component.scss']
})
export class DiagramflowIframComponent implements OnInit  {



  settingForm:FormGroup
  intentSettings:IntentSettings
  lang:string
  onDestroy$: Subject<void> = new Subject();
  projectName:string
  IframLink:SafeResourceUrl
  flowDiagramChanged: boolean = false

  expand:boolean = false
  constructor(private _tasksService: TasksService,
    private fb:FormBuilder,
    private notify:NotifyService,
    private _optionsService:OptionsServiceService,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private renderer: Renderer2,
     private el: ElementRef
    ) { }

    @Input() workspace_id
    @Input() intentId
    @Input() propertyId

    ngOnInit(): void {
        history.pushState(null, '', location.href);
      this._optionsService.selectedLang$.pipe(takeUntil(this.onDestroy$)).subscribe((res)=>{
        if(res){
          this.lang = res
          this.getProjectInfo()
        }
      })

      window.addEventListener('message', this.handleMessage);
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification(event: BeforeUnloadEvent) {
    if (this.flowDiagramChanged) {
      event.preventDefault();
      event.returnValue = 'You have unsaved changes in Diagram Flow. Are you sure you want to leave?';
    }
  }
@HostListener('window:popstate', ['$event'])
onPopState(event: PopStateEvent) {
  if (this.flowDiagramChanged) {
    const confirmLeave = confirm('You have unsaved changes in Diagram Flow. Do you really want to leave?');
    if (!confirmLeave) {
      // 👇 push state back to prevent leaving
      history.pushState(null, '', location.href);
    } else {
      this.flowDiagramChanged = false; // allow leaving
    }
  }
}
   private handleMessage = (event: MessageEvent) => {
    if (event.data === 'flowChanged') {
      this.flowDiagramChanged = true;
    } else if (event.data === 'flowSaved') {
      this.flowDiagramChanged = false;
    } else if (event.data === 'changeLang:ar') {
      this.lang = 'ar';
      // optional: trigger re-fetch or update
    } else if (event.data === 'changeLang:en') {
      this.lang = 'en';
    }
  };
  getProjectInfo(){
    this._optionsService.getProjectLangAndName(this.workspace_id).subscribe((res:any)=>{
      this.projectName = res.name
      debugger
      if(this.propertyId){
        this.IframLink = this.sanitizer.bypassSecurityTrustResourceUrl(`/Home/PnmDiagram?projectName=${this.projectName}&projectId=${this.workspace_id}&entityId=${this.intentId}&propertyId=${this.propertyId}&lang=${this.lang}`)
      }else{
        this.IframLink = this.sanitizer.bypassSecurityTrustResourceUrl(`/Home/PnmDiagram?projectName=${this.projectName}&projectId=${this.workspace_id}&entityId=${this.intentId}&propertyId=task&lang=${this.lang}`)
      }
    })
  }

  addDynamicStyles() {
    var  styles ;
    if(this.expand == false){
       styles = {
        display:'none'
        // Add more styles as needed
      };
      this.expand = true
      const element = this.el.nativeElement.querySelector('#expandFlowDiagram');
      this.renderer.setStyle(element, 'position', 'fixed');
      this.renderer.setStyle(element, 'top', '0px');
      this.renderer.setStyle(element, 'left', '0px');
    }
    else{
      styles = {
        display:'flex'
        // Add more styles as needed
      };
      this.expand = false
      const element = this.el.nativeElement.querySelector('#expandFlowDiagram');
      this.renderer.removeStyle(element, 'position')
      this.renderer.removeStyle(element, 'top')
      this.renderer.removeStyle(element, 'left')
    }
    this.addDynamicStyle('mat-drawer.mat-drawer-side', styles);
  }

  addDynamicStyle(className: string, styles: { [key: string]: string }) {
    const styleEl = this.renderer.createElement('style');
    styleEl.type = 'text/css';
    let cssRules = '';

    Object.keys(styles).forEach(property => {
      cssRules += `${property}: ${styles[property]};`;
    });

    styleEl.innerHTML = `.${className} { ${cssRules} }`;

    this.renderer.appendChild(document.head, styleEl);
  }
  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
     window.removeEventListener('message', this.handleMessage);
  }
}
