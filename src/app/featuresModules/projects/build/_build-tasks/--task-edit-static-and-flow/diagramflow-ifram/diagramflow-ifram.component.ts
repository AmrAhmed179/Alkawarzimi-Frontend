import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subject, takeUntil } from 'rxjs';
import { IntentSettings } from 'src/app/Models/build-model/intent-model';
import { TasksService } from 'src/app/Services/Build/tasks.service';
import { OptionsServiceService } from 'src/app/Services/options-service.service';
import { NotifyService } from 'src/app/core/services/notify.service';

@Component({
  selector: 'vex-diagramflow-ifram',
  templateUrl: './diagramflow-ifram.component.html',
  styleUrls: ['./diagramflow-ifram.component.scss']
})
export class DiagramflowIframComponent implements OnInit {



  settingForm:FormGroup
  intentSettings:IntentSettings
  lang:string
  onDestroy$: Subject<void> = new Subject();
  projectName:string
  IframLink:SafeResourceUrl

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
      this._optionsService.selectedLang$.pipe(takeUntil(this.onDestroy$)).subscribe((res)=>{
        if(res){
          this.lang = res
          this.getProjectInfo()
        }
      })
  }

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
  }
}
