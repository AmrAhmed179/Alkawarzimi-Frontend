import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { EntityModel } from 'src/app/Models/ontology-model/EntityCatogeryModel';
import { PrepListModel } from 'src/app/Models/ontology-model/prep-list';
import { Adv, CmpModyfier, CmpType, Frame, FrameCoreAttachments, FrameFeat, ObjModyfier, ObjType, ObjectEntitiesValue, SbjType, VerbModel } from 'src/app/Models/ontology-model/verb';
import { OntologyEntitiesService } from 'src/app/Services/Knowlege/ontology-entities.service';
import { OptionsServiceService } from 'src/app/Services/options-service.service';
import { DataService } from 'src/app/core/services/data.service';
import { NotifyService } from 'src/app/core/services/notify.service';
import { AddFrameAttachmentComponent } from './add-frame-attachment/add-frame-attachment.component';
import { NodeModel } from 'src/app/Models/ontology-model/node';
import { AddclassAsvalueComponent } from './addclass-asvalue/addclass-asvalue.component';
import { AddNewSenseComponent } from './add-new-sense/add-new-sense.component';
import { ReplaceSenseComponent } from './replace-sense/replace-sense.component';
import { ShowENComponent } from './show-en/show-en.component';
import { MagicWordWriteComponent } from 'src/app/shared/components/magic-word-write/magic-word-write.component';

@Component({
  selector: 'vex-selected-entity-frame',
  templateUrl: './selected-entity-frame.component.html',
  styleUrls: ['./selected-entity-frame.component.scss']
})
export class SelectedEntityFrameComponent implements OnInit {
  frameIndex:number
  currentSenceIndex:number =0
  sense:VerbModel
  onDestroy$: Subject<void> = new Subject();
  projectId:string
  entityId:string
  entities:EntityModel[]
  entity:EntityModel
  Verb:string
  verbs:VerbModel[]
  prepList:PrepListModel[]
  prepValue:string
  Adverbs:EntityModel[]
  adverbValue:string
  classesAndPropsFilter:EntityModel[]
  classesAndProps:EntityModel[]
  currentClassAndPrpsIndex:number = 0
  entityTypeValue:string = 'all'
  search:string = ''
  lang:string
  nodes:NodeModel[] = []
  currentFrameAttacIndex:number
  coreAttachObjectIndex:number
  objectEntitiesValues:ObjectEntitiesValue[]
  stemSense:any[] = []
  returnPage:string = ''
  constructor(private route: ActivatedRoute,
    private _ontologyEntitiesService:OntologyEntitiesService,
    private _dataService: DataService,
    private fb:FormBuilder,
    private notify: NotifyService,
    public dialog: MatDialog,
    private router: Router,
    private _optionsService:OptionsServiceService,

  ) { }

  ngOnInit(): void {
    this._optionsService.selectedLang$.pipe(takeUntil(this.onDestroy$)).subscribe((res)=>{
      if(res){
        this.lang = res
        this._dataService.$project_bs.pipe(takeUntil(this.onDestroy$)).subscribe((project:any)=>{
          if(project){
          this.projectId = project._id
          debugger
          this.route.parent.paramMap.subscribe(params => {
            this.entityId = params.get('entityId');
            this.Verb = this.removeArabicFormation(params.get('Verb'))
            this.returnPage = params.get('returnPage');
            this.getAdverbs()
            this.getPrepList()
            this.getClassandProp()
            this.getPropertiesIndex()
            this.getEntities()
          });
      }}
      )
      }
    })
  }

  getFrame(){
    this._ontologyEntitiesService.getFrame(this.projectId, this.Verb).subscribe((res:any)=>{
      if(res.status == 1){
        debugger

          this.verbs = res.verbs
          this.verbs.forEach(element => {
            if(element.frames.length == 0){
              debugger
              let entity = this.entities.find(x=>x._id == +this.entityId)
              let frame = new Frame();
              if(entity.type){
                 frame.type = entity.type
                }
                else{
                  frame.type='xx'
                }
              element.frames.push(frame)
            }

            element.frames.forEach(el=>{

              if(el){
                if(el?.frameFeat == null)
                  el.frameFeat = new FrameFeat()
                if(el?.adv == null)
                  el.adv = []
                if(el?.objType == null)
                  el.objType = new ObjType()
                if(el?.obj == null)
                  el.obj = []
                if(el?.sbjType == null)
                  el.sbjType = new SbjType()
                if(el?.sbj == null)
                  el.sbj = []
                if(el?.cmpType == null)
                  el.cmpType = new CmpType()
                if(el?.cmp == null)
                  el.cmp = []
                if(el?.cmpModyfier == null)
                  el.cmpModyfier = new CmpModyfier()
                if(el?.objModyfier == null)
                  el.objModyfier = new ObjModyfier()
              }
            })
        });
        debugger
          if(this.verbs.length > 0){
            this.sense = this.verbs[0]
            this.frameIndex = this.sense.frames.findIndex(x=>x.entityId == this.entityId)
            if(this.frameIndex == -1){
              var fram:Frame = new Frame()
              fram.parentId = this.entityId
              fram.entityId = this.entityId
              fram.verb = this.Verb
              fram.senseId = res.senseId
              this.sense.frames = []
              this.sense.frames.push(fram)
              this.frameIndex = this.sense.frames.length - 1
            }}
      }
    })
  }

  buildFramesArray(){
          this.verbs.forEach(element => {
            if(element.frames.length == 0){
              debugger
              let entity = this.entities.find(x=>x._id == +this.entityId)
              let frame = new Frame();
              if(entity.type){
                 frame.type = entity.type
                }
                else{
                  frame.type='xx'
                }
              element.frames.push(frame)
            }

            element.frames.forEach(el=>{

              if(el){
                if(el?.frameFeat == null)
                  el.frameFeat = new FrameFeat()
                if(el?.adv == null)
                  el.adv = []
                if(el?.objType == null)
                  el.objType = new ObjType()
                if(el?.obj == null)
                  el.obj = []
                if(el?.sbjType == null)
                  el.sbjType = new SbjType()
                if(el?.sbj == null)
                  el.sbj = []
                if(el?.cmpType == null)
                  el.cmpType = new CmpType()
                if(el?.cmp == null)
                  el.cmp = []
                if(el?.cmpModyfier == null)
                  el.cmpModyfier = new CmpModyfier()
                if(el?.objModyfier == null)
                  el.objModyfier = new ObjModyfier()
              }
            })
          })
  }

  SelectCurrentSenceIndex(i){
    debugger
    this.currentSenceIndex = i
    if (!("isType" in this.verbs[i])) {
      this.verbs[i].frames[this.frameIndex].isType = false
    }
    if (!("pastEvent" in this.verbs[i])) {
      this.verbs[i].frames[this.frameIndex].pastEvent = false
    }
    if (!("negative" in this.verbs[i])) {
      this.verbs[i].frames[this.frameIndex].negative = false
    }
    if (!("Informative" in this.verbs[i])) {
      this.verbs[i].frames[this.frameIndex].Informative = false
    }
    if (!("ignoreTellAbout" in this.verbs[i])) {
      this.verbs[i].frames[this.frameIndex].ignoreTellAbout = false
    }
     if (!("ignoreExplain" in this.verbs[i])) {
      this.verbs[i].frames[this.frameIndex].ignoreExplain = false
    }

    this.sense = this.verbs[i]
    console.log(this.verbs)
  }

  getEntities(){
    this._ontologyEntitiesService.getEntities(this.projectId, 'action', 1).subscribe((res:any)=>{
      debugger
      this.entities = res.entities
      this.entity = this.entities.find(x=>x._id == +this.entityId)
      this.getFrame()

      console.log(this.entity)
    })
  }

  frameDetect(){
  }

  getAdverbs(){
    this._ontologyEntitiesService.getAdverbEntities(this.projectId,0,'adverb').subscribe((res:any)=>{
      this.Adverbs = res.entities
    })
  }

  getPrepList(){
    this._ontologyEntitiesService.getPrepList('Ar').subscribe((res:any)=>{
      this.prepList = res.preps
    })
  }

  getClassandProp(){
    this._ontologyEntitiesService.getClassandProp(this.projectId).subscribe((res:any)=>{
      this.classesAndPropsFilter = res.entities
      this.classesAndProps = res.entities
    })
  }
  formChang(){
    var entityTypeValue = this.entityTypeValue
    var search = this.search


    if(search.trim() != ''){
        this.classesAndProps = this.classesAndPropsFilter.filter(x=>x.entityInfo[0].entityText.trim().includes(search.trim()) && x.entityType ==entityTypeValue)
        this.currentClassAndPrpsIndex = 0

    }
    else{
      if(entityTypeValue =='all'){
         this.classesAndProps =  this.classesAndPropsFilter
         this.currentClassAndPrpsIndex = 0
      }
      else{
        this.classesAndProps = this.classesAndPropsFilter.filter(x=> x.entityType ==entityTypeValue)
        this.currentClassAndPrpsIndex = 0
      }
    }

  }
  clickOnList(entity:EntityModel, index){
    this.currentClassAndPrpsIndex = index
  }

  addAdverb(){
    let entity =  this.Adverbs.find(x=>x._id == +this.adverbValue)
    let verb = new Adv()
    verb.i = entity._id
    verb.s = entity.entityInfo[0].entityText
    verb.t ="c"
    let deblicated = this.sense.frames[this.frameIndex].adv.find(x=>x.i == entity._id)
    if(deblicated)
      return
    this.sense.frames[this.frameIndex].adv.push(verb)
  }

  addComplement(){
    let entity =  this.classesAndProps[this.currentClassAndPrpsIndex]
    let verb = new Adv()
    verb.i = entity._id
    verb.s = entity.entityInfo[0].entityText
    verb.t ="c"
    let deblicated = this.sense.frames[this.frameIndex].cmp.find(x=>x.i == entity._id)
    if(deblicated)
      return
    this.sense.frames[this.frameIndex].cmp.push(verb)
  }
  addObject(){
    let entity =  this.classesAndProps[this.currentClassAndPrpsIndex]
    let verb = new Adv()
    verb.i = entity._id
    verb.s = entity.entityInfo[0].entityText
    verb.t ="c"
    let deblicated = this.sense.frames[this.frameIndex].obj.find(x=>x.i == entity._id)
    if(deblicated)
      return
    this.sense.frames[this.frameIndex].obj.push(verb)
  }
  addSubject(){
    let entity =  this.classesAndProps[this.currentClassAndPrpsIndex]
    let verb = new Adv()
    verb.i = entity._id
    verb.s = entity.entityInfo[0].entityText
    verb.t ="c"
    let deblicated = this.sense.frames[this.frameIndex].sbj.find(x=>x.i == entity._id)
    if(deblicated)
      return
    this.sense.frames[this.frameIndex].sbj.push(verb)
  }

  deleteAderb(index:number){
    this.sense.frames[this.frameIndex].adv.splice(index,1)
  }

  deleteComplement(index:number){
    this.sense.frames[this.frameIndex].cmp.splice(index,1)
  }
  deleteObject(index:number){
    this.sense.frames[this.frameIndex].obj.splice(index,1)
  }

  deleteSubject(index:number){
    this.sense.frames[this.frameIndex].sbj.splice(index,1)
  }
  addCmpModyfier(){

    let deblicated = this.sense.frames[this.frameIndex].cmpModyfier?.preps.includes(this.prepValue)
    if(deblicated)
      return
    this.sense.frames[this.frameIndex].cmpModyfier?.preps.push(this.prepValue)
  }

  addObjModyfier(){
    let deblicated = this.sense.frames[this.frameIndex].objModyfier?.preps.includes(this.prepValue)
    if(deblicated)
      return
    this.sense.frames[this.frameIndex].objModyfier?.preps.push(this.prepValue)
  }

  deleteCmpModyfier(index:number){
    this.sense.frames[this.frameIndex].cmpModyfier.preps.splice(index,1)
  }

  deleteObjModyfier(index:number){
    this.sense.frames[this.frameIndex].objModyfier.preps.splice(index,1)
  }
  getPrep(id){
    return this.prepList.find(x=>x.stemId == +id)?.stem
  }

  openAddCoreAttachment(){
    const dialogRef = this.dialog.open(AddFrameAttachmentComponent, {
      data: { nodes:this.nodes},},
    );
    dialogRef.afterClosed().subscribe((res:any) => {
      debugger
      if(res){
       var framCore = this.sense.frames[this.frameIndex].frameCoreAttachments.find(x=>x.predicateId == res)
       if(framCore){
        return
       }
       else{
        let framCore = new FrameCoreAttachments()
          framCore.predicateId = +res
          framCore.objectValue = null
          framCore.predicateType = 'attachment'
          framCore.propSubClasses = null
        this.sense.frames[this.frameIndex].frameCoreAttachments.push(framCore)
       }
      }
    })
  }
  getPropertiesIndex(){
    this._ontologyEntitiesService.propertiesIndex('dataProp').subscribe((res:any)=>{
      this.nodes = res.nodes
    })
  }

  getFrameCore(frameCore:FrameCoreAttachments){
    return this.nodes.find(x=>x.entityId == frameCore.predicateId)?.entityText
  }

  clickOnframeAttch(i){
    this.currentFrameAttacIndex = i
    this.objectEntitiesValues = this.sense.frames[this.frameIndex].frameCoreAttachments[this.currentFrameAttacIndex].objectEntitiesValues
  }
  openAddClassAsValue(){
    debugger
    const dialogRef = this.dialog.open(AddclassAsvalueComponent, {
      data: { entities:this.classesAndPropsFilter},},
    );
    dialogRef.afterClosed().subscribe((res:any) => {
      if(res){
        debugger
        let entity = this.classesAndPropsFilter.find(x=>x._id == +res)
        let exsistEntity = this.sense.frames[this.frameIndex].frameCoreAttachments[this.currentFrameAttacIndex].objectEntitiesValues.find(x=>x.entityId == +res)
        if(exsistEntity)
          return;
        let objValue = new ObjectEntitiesValue()
        objValue.entityId = entity._id
        objValue.entityType = entity.entityType
        objValue.negative = entity?.frame?.negative ? entity?.frame?.negative : false
        objValue.nValue = 0
        objValue.value = entity.entityInfo[0].entityText
        this.sense.frames[this.frameIndex].frameCoreAttachments[this.currentFrameAttacIndex].objectEntitiesValues.push(objValue)
      }
    })
  }
  clickOnCoreAttachObject(index){
    this.coreAttachObjectIndex = index
  }
  close(){
    if(this.returnPage == '1'){
     this.router.navigate([`/projects/${this.projectId}/knowledge/ontologyEntities/Frames`])
    }
    else{
      this.router.navigate([`/projects/${this.projectId}/ontologyTree/ontologyTreeView`])
    }
  }
  saveFrame(){
    debugger
      let entity = this.entities.find(x=>x._id == +this.entityId)
    if(!this.sense.frames[this.frameIndex].entityId) {
      if(entity.type){
        this.sense.frames[this.frameIndex].type = entity.type
      }
       else{
        this.sense.frames[this.frameIndex].type ='xx'
       }
       debugger
    this.sense.frames[this.frameIndex].entityId = this.entityId
    this.sense.frames[this.frameIndex].verb = this.Verb
    this.sense.frames[this.frameIndex].parentId = entity._id.toString()
    this.sense.frames[this.frameIndex].senseId =  this.sense.senseId
    }
    this._ontologyEntitiesService.SaveFrame(this.projectId, this.sense.frames[this.frameIndex]).subscribe((res:any)=>{
      if(res.status == '1'){
        this.notify.openSuccessSnackBar('Frame Saved Successfuly')
      }
    })
  }

  openAddNewSense(){
    this._ontologyEntitiesService.GetStemSense(this.lang, this.Verb).subscribe((res:any)=>{
      if(res.status == '1'){
       this.stemSense = res.senses
       const dialogRef = this.dialog.open(AddNewSenseComponent, {
        data: { senses:this.stemSense,lang:this.lang, verb:this.Verb, projectId:this.projectId},},
      );
      dialogRef.afterClosed().subscribe((res:any) => {
        debugger
        if(res){
          this.verbs.push(res)
          this.sense = this.verbs[this.verbs.length - 1]
          let fram:Frame = new Frame()
          fram.parentId = this.entityId
          fram.entityId = this.entityId
          fram.verb = this.Verb
          fram.senseId = res.senseId
          this.sense.frames = []
          this.sense.frames.push(fram)
          this.frameIndex = this.sense.frames.length - 1
        }
      })
      }
      else{
        this.notify.openFailureSnackBar(res.message)
      }
    })
  }
  openReplaceSense(){
    this._ontologyEntitiesService.GetStemSense(this.lang, this.Verb).subscribe((res:any)=>{
      if(res.status == '1'){
       this.stemSense = res.senses
       const dialogRef = this.dialog.open(ReplaceSenseComponent, {
        data: { senses:this.stemSense,lang:this.lang, verb:this.Verb, projectId:this.projectId, sense:this.sense.senseId},},
      );
      dialogRef.afterClosed().subscribe((res:any) => {
        debugger
        if(res){
          this.getFrame()
          this.currentSenceIndex=0
        }
      })
      }
      else{
        this.notify.openFailureSnackBar(res.message)
      }
    })
  }
  DeleteVerbFrame(){
    let sense = this.sense

    let verb = new VerbModel()
    verb.lang = this.lang
    verb.verb = this.Verb
    verb.senseId = sense.senseId
    verb.generated = false
    verb.description = sense.description
    verb.function = 0
    verb.synonyms = []
    verb.frq = 0
    verb.frames = []
    verb.found = false
    verb.templateId = 0
    verb.verbs =  null
    verb.synonmsSet = null

    this._ontologyEntitiesService.DeleteVerbFrame(this.projectId, verb).subscribe((res:any)=>{
      if(res.status == '1'){
        this.notify.openSuccessSnackBar("Successfuly Deleted")
        this.getFrame()
          this.currentSenceIndex=0
      }
    })
  }

  openShowEn(){
       const dialogRef = this.dialog.open(ShowENComponent, {
        data: {senseId:this.sense.senseId}},
      );
      dialogRef.afterClosed().subscribe((res:any) => {
        debugger
        if(res){
          this.getFrame()
          this.currentSenceIndex = 0
        }
      })
  }
  deleteFrame(){
    let QuestionTitle = "Are you sure you want to delete this ?"
    let pleasWriteMagic = "Please write the **Magic** word to delete"
    let actionName = "delete"
    const dialogRef = this.dialog.open(MagicWordWriteComponent,
      {
        data: { QuestionTitle: QuestionTitle, pleasWriteMagic: pleasWriteMagic, actionName: actionName }, maxHeight: '760px',
        width: '600px',
        position: { top: '100px', left: '400px' }
      });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this._ontologyEntitiesService.DeleteFrame(this.entityId,this.projectId).subscribe((res:any)=>{
          if(res.status == '1'){
            this.notify.openSuccessSnackBar("Frame Deleted Successfuly ")
            this.getFrame()
          }
          else{
            this.notify.openFailureSnackBar("Error")
          }
        })
      }
    })


  }

   removeArabicFormation(text: string): string {
    // Regex to match Arabic diacritical marks
    const formationRegex = /[\u064B-\u065F]/g;
    return text.replace(formationRegex, '');
 }
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
