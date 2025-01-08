import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { NotifyService } from 'src/app/core/services/notify.service';
import { DialogNodesConvert } from 'src/app/Models/build-model/dialog-convert-model';
import { AllTask } from 'src/app/Models/build-model/intent-model';
import { DialogNodes, OptionModelEnAR, TemplateConvert, ValueEnAR } from 'src/app/Models/build-model/static-response-dialogs-modesl';
import { TasksService } from 'src/app/Services/Build/tasks.service';
import { OptionsServiceService } from 'src/app/Services/options-service.service';

@Component({
  selector: 'vex-knowledge-taskstatic-response',
  templateUrl: './knowledge-taskstatic-response.component.html',
  styleUrls: ['./knowledge-taskstatic-response.component.scss']
})

export class KnowledgeTaskstaticResponseComponent implements OnInit {

  actionButtonMode:string
  currentIdex:number
  lang:string
  onDestroy$: Subject<void> = new Subject();
  value:string = '0.5'
  isPanelOpen:Boolean = false
  get output(): FormArray {
    return this.dialogNodeForm?.get('output') as FormArray
  }

  returnValueArray(control){
    return control.get('text')?.get('valueArEn')?.controls
  }
   returnResOptionGroup(control){
    return control.get('text').get('resOptions') as FormGroup
  }

  returnOptionArray(control){
    return control.get('text').get('resOptions').get('optionsArEn').controls
  }
  returnTextControl(control){
    return control.get('text')
  }

  returnOutControl(control){
    return control as FormGroup
  }

  returnTemplateControl(control){
    return control.get('text').get('templateConvert') as FormGroup
  }
  disablePanel(event: MouseEvent): void {
    event.stopPropagation();
  }
  tasks:AllTask[]
  dialogNodesConvert:DialogNodesConvert = new DialogNodesConvert()
  dialogNodeForm:FormGroup

  showForm:boolean = false
  textForm:FormGroup
  optionForm:FormGroup
  listForm:FormGroup
  imageForm:FormGroup
  goToForm:FormGroup
  carouselForm:FormGroup
  chartForm:FormGroup

  constructor(private _tasksService: TasksService,
    private fb:FormBuilder,
    private notify:NotifyService,
    private _optionsService:OptionsServiceService,
    public dialog: MatDialog,
    ) { }

    @Input() workspace_id
    @Input() intentId
    @Input() dialogNodes

    @Output() sendObject = new EventEmitter<any>();
    panelOpenState = false;

    ngOnInit(): void {
      this.convertData()
      this.initializeForm()
      console.log(this.dialogNodeForm.value)
      console.log('Convert',this.dialogNodes)
      this._optionsService.selectedLang$.pipe(takeUntil(this.onDestroy$)).subscribe((res)=>{
        if(res){
          this.lang = res
          debugger
        }
      })
  }

  addValue(control){

    if(this.lang=='ar'){
      control.get('text').get('valueArEn')?.push(this.fb.group({
        ar:[' '],
        en:[''],
        value:[''],
      }))
    }
     if(this.lang=='en'){
      control.get('text').get('valueArEn')?.push(this.fb.group({
        ar:[''],
        en:[' '],
        value:[''],
      }))
    }
  }

  addOption(control){
    control.get('text').get('resOptions').get('optionsArEn').push(this.fb.group({
      label: [''],
      value: [''],
      iconSrc: [''],
      labelAr: [''],
      labelEn: [''],
    }))
  }
  deleteOption(control, index){
    control.get('text').get('resOptions').get('optionsArEn').removeAt(index)
  }
  deleteValue(control,index){
    control.get('text').get('valueArEn').removeAt(index)
  }

  deleteResponse(control,index){
    this.output.removeAt(index)
  }
  initializeForm(){
    debugger
    this.dialogNodeForm = this.fb.group({
      type:[this.dialogNodes?.type],
      disable:[this.dialogNodes?.disable],
      intentId:[this.dialogNodes?.intentId],
      dialog_node:[this.dialogNodes?.dialog_node],
      title:[this.dialogNodes?.title],
      parent:[this.dialogNodes?.parent],
      description:[this.dialogNodes?.description],
      next_step:[this.dialogNodes?.next_step],
      conditionGroup:[this.dialogNodes?.conditionGroup],
      event_name:[this.dialogNodes?.event_name],
      display_policy:[this.dialogNodes?.display_policy],
      filled:[this.dialogNodes?.filled],
      behavior:[this.dialogNodes?.behavior],
      notFilled:[this.dialogNodes?.notFilled],
      ignoreOldValue:[this.dialogNodes?.ignoreOldValue],
      sourceBot:[this.dialogNodes?.sourceBot],
      serviceObject:[this.dialogNodes?.serviceObject],
      triggeredObject:[this.dialogNodes?.triggeredObject],
      expProcess:[this.dialogNodes?.expProcess],
      executeService:[this.dialogNodes?.executeService],
      services:[this.dialogNodes?.services],
      variables:[this.dialogNodes?.variables],
      previous_sibling:[this.dialogNodes?.previous_sibling],
      variable:[this.dialogNodes?.variable],
      focus:[this.dialogNodes?.focus],
      reset:[this.dialogNodes?.reset],
      isList:[this.dialogNodes?.isList],
      required:[this.dialogNodes?.required],
      digressionResponse:[this.dialogNodes?.digressionResponse],
      deleteServiceObject:[this.dialogNodes?.deleteServiceObject],
      created:[this.dialogNodes?.created],
      updated:[this.dialogNodes?.updated],
      output:this.fb.array([])
    })
debugger
    this.dialogNodes?.output.forEach(output=>{
      const outputGroup = this.fb.group({
        text: this.fb.group({
          valueArEn: this.fb.array([]),
          values:[[]],
          selection_policy: [output.text.selection_policy],
          resOptions: this.fb.group({
            title:[output.text?.resOptions?.title],
            titleAr:[output.text?.resOptions?.titleAr],
            titleEn:[output.text?.resOptions?.titleEn],
            description:[output.text?.resOptions?.description],
            mainOptions:[output.text?.resOptions?.mainOptions],
            optionsArEn: this.fb.array([])
           }),

          goToTaskId: [output.text?.goToTaskId],
          template: [output.text?.template],
          templateConvert: this.fb.group({
            title:[output.text?.templateConvert?.title],
            src:[output.text?.templateConvert?.src],
            hyperlink:[output.text?.templateConvert?.hyperlink],
            titleAr:[output.text?.templateConvert?.titleAr],
            titleEn:[output.text?.templateConvert?.titleEn],
          })
        }),
        response_type:[output.response_type],
        typingDelay:[output.typingDelay],
      })

      output.text?.valueArEn?.forEach(value=>{
        debugger
        const valueGroup = this.fb.group({
          value:[value?.value],
          en:[value?.en ],
          ar:[value?.ar ],
        })

        const valueGet = outputGroup.get('text').get('valueArEn') as FormArray
        valueGet.push(valueGroup)
      })
      output.text?.resOptions?.optionsArEn?.forEach(option=>{
       const optionGruop =  this.fb.group({
          label: [option?.label],
          value: [option?.value],
          iconSrc: [option?.iconSrc],
          labelAr: [option?.labelAr],
          labelEn: [option?.labelEn],
        })
        const optionGet = outputGroup.get('text').get('resOptions').get('optionsArEn') as FormArray
        optionGet.push(optionGruop)
      })
      this.output.push(outputGroup)

    })
    console.log('intialtFormValue',this.dialogNodeForm.value)
  }

  addResponse(responseName:string, responeValueL:number){
    if(responseName =='Text'){
      this.output.push(this.fb.group({
        typingDelay:['0'],
        response_type:['Text'],
        text:this.fb.group({
          selection_policy:['random'],
          valueArEn:this.fb.array([])
        })
      }))
    }

    if(responseName =='Option'){
      this.output.push(this.fb.group({
        typingDelay:['0'],
        response_type:['Option'],
        text:this.fb.group({
          selection_policy:['random'],
          resOptions:this.fb.group({
            title:[''],
            titleAr:[''],
            titleEn:[''],
            description:[''],
            optionsArEn: this.fb.array([])
          })
        })
      }))
    }

    if(responseName =='List'){
      this.output.push(this.fb.group({
        typingDelay:['0'],
        response_type:['List'],
        text:this.fb.group({
          selection_policy:['random'],
          resOptions:this.fb.group({
            title:[''],
            titleAr:[''],
            titleEn:[''],
            description:[''],
            mainOptions:[''],
            optionsArEn: this.fb.array([])
          })
        })
      }))
    }


    if(responseName =='Image'){
      this.output.push(this.fb.group({
        typingDelay:['0'],
        response_type:['Image'],
        text:this.fb.group({
          selection_policy:['random'],
          templateConvert: this.fb.group({
            title:[''],
            src:[''],
            hyperlink:[''],
            titleAr:[''],
            titleEn:[''],
          })
        })
      }))
    }

    if(responseName =='GoTo'){
      this.output.push(this.fb.group({
        typingDelay:['0'],
        response_type:['GoTo'],
        text:this.fb.group({
          selection_policy:['random'],
          goToTaskId:['']
        })
      }))
    }

    if(responseName =='Carousel'){
      var textResponse =
      this.output.push(this.fb.group({
        typingDelay:['0'],
        response_type:['Carousel'],
        text:this.fb.group({
          selection_policy:['random'],
        })
      }))
    }
    if(responseName =='Chart'){
      var textResponse =
      this.output.push(this.fb.group({
        typingDelay:['0'],
        response_type:['Chart'],
        text:this.fb.group({
          selection_policy:['random'],
        })
      }))
    }
  }
  drop(event: CdkDragDrop<any>) {
    debugger
    moveItemInArray(this.output.controls, event.previousIndex, event.currentIndex);
    moveItemInArray(this.output.value, event.previousIndex, event.currentIndex);
  }


  convertData(){
    this.dialogNodes?.output?.forEach((el,outputIndex)=>{
      this.dialogNodes.output[outputIndex].text.valueArEn =[]
      if(el.response_type == 'Text'){
        el.text.values?.forEach((value)=>{
          let valueEnAR:ValueEnAR = new ValueEnAR()
          valueEnAR.value =value
          let v = value.split('#')
          if(v.length == 1){
            valueEnAR.ar = v[0]
            valueEnAR.en = ''
          }
          debugger
          if(v[1] && v[1] == 'ar'){
            valueEnAR.ar = v[2]
            valueEnAR.en = ''
          }
          if(v[1] && v[1] == 'en'){
            valueEnAR.en = v[2]
            valueEnAR.ar = ''
          }
          this.dialogNodes.output[outputIndex].text.valueArEn.push(valueEnAR)
        })
      }

      if(el.response_type == 'Option'){
        this.dialogNodes.output[outputIndex].text.resOptions.optionsArEn =[]

        var resOptionLabel =  el.text.resOptions.title.split('#')
        if (resOptionLabel[1]&& resOptionLabel[1] == 'ar'){
          el.text.resOptions.titleAr = resOptionLabel[2]
        }
        if(resOptionLabel[3] && resOptionLabel[3] == 'en'){
          el.text.resOptions.titleEn = resOptionLabel[4]
        }
        el.text.resOptions?.options?.forEach((option,optionIndex)=>{
          let OptionArEn:OptionModelEnAR = new OptionModelEnAR()
          OptionArEn.iconSrc = option.iconSrc
          OptionArEn.label = option.label
          OptionArEn.value = option.value
          debugger
          let optionLabel = option.label.split('#')
          if(optionLabel[1] && optionLabel[1] == 'ar'){
            OptionArEn.labelAr = optionLabel[2]
          }
          if(optionLabel[3] && optionLabel[3] == 'en'){
            OptionArEn.labelEn = optionLabel[4]
          }
          this.dialogNodes.output[outputIndex].text.resOptions?.optionsArEn.push(OptionArEn)
        })
      }

      if(el.response_type == 'List'){
        this.dialogNodes.output[outputIndex].text.resOptions.optionsArEn =[]

        var resOptionLabel =  el.text.resOptions.title.split('#')
        if (resOptionLabel[1]&& resOptionLabel[1] == 'ar'){
          el.text.resOptions.titleAr = resOptionLabel[2]
        }
        if(resOptionLabel[3] && resOptionLabel[3] == 'en'){
          el.text.resOptions.titleEn = resOptionLabel[4]
        }
        el.text.resOptions?.options?.forEach((option,optionIndex)=>{
          let OptionArEn:OptionModelEnAR = new OptionModelEnAR()
          OptionArEn.iconSrc = option.iconSrc
          OptionArEn.label = option.label
          OptionArEn.value = option.value
          debugger
          let optionLabel = option.label.split('#')
          if(optionLabel[1] && optionLabel[1] == 'ar'){
            OptionArEn.labelAr = optionLabel[2]
          }
          if(optionLabel[3] && optionLabel[3] == 'en'){
            OptionArEn.labelEn = optionLabel[4]
          }
          this.dialogNodes.output[outputIndex].text.resOptions?.optionsArEn.push(OptionArEn)
        })
      }
      if(el.response_type == 'Image'){
        debugger
          var  templateConvert = new TemplateConvert();
          templateConvert = JSON.parse(el.text.template)
          var temlateTitle =  templateConvert.title.split('#')

        if (temlateTitle[1]&& temlateTitle[1] == 'ar'){
          templateConvert.titleAr = temlateTitle[2]
        }
        if(temlateTitle[3] && temlateTitle[3] == 'en'){
          templateConvert.titleEn = temlateTitle[4]
        }
        el.text.templateConvert = templateConvert
      }
    })
    console.log('convertedDate',this.dialogNodes)
  }

  submitForm(){
    debugger
    var formObject:DialogNodes = this.dialogNodeForm.value
    formObject.output?.forEach(e=>{
      if(e.response_type =='Text'){
        e.text.langValues = []
        e.text.values =[]
        e.text.valueArEn?.forEach(valueAREN=>{
          if(valueAREN.ar != ''){
            e.text.values.push('#ar#'+valueAREN.ar)
            e.text.langValues.push({lang:'ar',text:valueAREN.ar})
          }
          if(valueAREN.en != ''){
            e.text.values.push('#en#'+valueAREN.en)
            e.text.langValues.push({lang:'en',text:valueAREN.en})
          }
        })
        delete e.text.valueArEn
        delete e.text.templateConvert
        e.text.resOptions =null
      }
      if(e.response_type =='Option' || e.response_type =='List' ){
        e.text.resOptions.title ='#ar#'+ e.text.resOptions.titleAr + '#en#'+ e.text.resOptions.titleEn
        delete e.text.resOptions.titleAr
        delete e.text.resOptions.titleEn
        delete e.text.valueArEn
        delete e.text.templateConvert

        e.text.resOptions.options = []
        e.text.resOptions?.optionsArEn?.forEach(optionAREN=>{
          e.text.resOptions.options.push({label:'#ar#'+optionAREN?.labelAr+'#en#'+optionAREN?.labelEn,value:optionAREN?.value,iconSrc:optionAREN?.iconSrc})
        })
        delete e.text.resOptions.optionsArEn
      }
      if(e.response_type =='Image' ){
        e.text.template = JSON.stringify({
          title:'#ar#'+e.text?.templateConvert?.titleAr+'#en#'+e.text?.templateConvert?.titleAr,
          src:  e.text?.templateConvert?.src,
          hyperlink:  e.text?.templateConvert?.hyperlink,
          })
          e.text.resOptions =null
          delete e.text.valueArEn
          delete e.text.templateConvert
      }

      if(e.response_type =='GoTo'){
        e.text.resOptions = null
        delete e.text.valueArEn
        delete e.text.templateConvert
      }
    })

    this.sendObject.emit(formObject)
    console.log('form Value', this.dialogNodeForm.value)
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
