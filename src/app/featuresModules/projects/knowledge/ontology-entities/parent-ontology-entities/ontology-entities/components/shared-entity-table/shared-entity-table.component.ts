import { ChangeDetectionStrategy, Component,  Input,  OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { EntityCatogeryModel, EntityModel } from 'src/app/Models/ontology-model/EntityCatogeryModel';
import { OntologyEntitiesService } from 'src/app/Services/Knowlege/ontology-entities.service';
import { DataService } from 'src/app/core/services/data.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { NotifyService } from 'src/app/core/services/notify.service';
import { MatDialog } from '@angular/material/dialog';
import { MagicWordWriteComponent } from 'src/app/shared/components/magic-word-write/magic-word-write.component';
import { SelectFactCategoryComponent } from '../../dialogs/select-fact-category/select-fact-category.component';
import { ShowRealtedFramesAndEligibleComponent } from '../../dialogs/show-realted-frames-and-eligible/show-realted-frames-and-eligible.component';
import { ShowRelatedFramesComponent } from '../../dialogs/show-related-frames/show-related-frames.component';
import { ArgumentMappingComponent } from '../../dialogs/argument-mapping/argument-mapping.component';
import { EntityBehaviorComponent } from '../../dialogs/entity-behavior/entity-behavior.component';
import { DeconstructClassComponent } from '../../dialogs/deconstruct-class/deconstruct-class.component';
import { CreateOntologyEntityComponent } from '../../dialogs/create-ontology-entity/create-ontology-entity.component';

@Component({
  selector: 'vex-shared-entity-table',
  templateUrl: './shared-entity-table.component.html',
  styleUrls: ['./shared-entity-table.component.scss'],
})
export class SharedEntityTableComponent implements OnInit {

  onDestroy$: Subject<void> = new Subject();
  category:EntityCatogeryModel[]
  factCatogeries:any[]
  projectId:string
  entities:EntityModel[]
  ontologyEntities:EntityModel[]
  ontologyEntitiesFilter:EntityModel[]
  reloadEntiesFlage:boolean = false
  @Input() type
  form:FormGroup
  currentIndex:number
  entityTitle:string
  childrenEntites:EntityModel[] = []
  @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport;

  clickedEntity:EntityModel
  clickedEntityIndex:number
  constructor(private _ontologyEntitiesService:OntologyEntitiesService,
    private route: ActivatedRoute,
    private _dataService: DataService,
    private fb:FormBuilder,
    private notify: NotifyService,
    public dialog: MatDialog,
    private router: Router,
    ) { }
  ngOnInit(): void {
    this._ontologyEntitiesService.ReloadEntitesInCreation$.pipe(takeUntil(this.onDestroy$)).subscribe(res=>{
      if(res){
        this.reloadEntiesFlage = true
        if(this.type == 'gneratedFrames'){
          this.getGeneratedEntities()
        }
        else{
          this.getEntities()
        }
      }
    })
    this._dataService.$project_bs.pipe(takeUntil(this.onDestroy$)).subscribe((project:any)=>{
      if(project){
      this.projectId = project._id
      this.getFactCategories()
      debugger
      if(this.type == 'gneratedFrames'){
        this.getGeneratedEntities()
      }
      else{
        this.getEntities()
      }
       this.intiateForm()
      }
    })
  }

  intiateForm(){
    this.form = this.fb.group({
      Category:[],
      Filter:[],
      search:[],
    })
  }
  getEntities(){
    this._ontologyEntitiesService.getEntities(this.projectId, this.type, 1).subscribe((res:any)=>{
      debugger
      this.entities = res.entities
      this.sortEntites()
    })
  }

  getGeneratedEntities(){
    this._ontologyEntitiesService.getGeneratedFrames(this.projectId).subscribe((res:any)=>{
      debugger
      this.entities = res.entitiParent.concat(res.generatedFramesList)
      this.sortEntites()
    })
  }
  sortEntites(){
    var allParents = this.entities.filter(x=>x.parentId == 0)
    debugger
     this.ontologyEntities = allParents.sort((n1,n2) => {
      if (n1._id > n2._id) {
          return 1;
      }

      if (n1._id < n2._id) {
          return -1;
      }

      return 0;
  });

  for (let i = 0; i < this.ontologyEntities.length; i++) {
    let entityParentId =this.ontologyEntities[i]._id

    var entity = this.entities.filter(y=>y.parentId == entityParentId)
      this.ontologyEntities[i].children = entity
    }

    this.ontologyEntitiesFilter = this.ontologyEntities

    if(this.reloadEntiesFlage == true)
      this.clickOnList2()

    this.reloadEntiesFlage = false
  }

  formChang(clear:string){
    debugger
    if(clear == 'clear')
        this.form.reset()
    var Category= this.form?.controls['Category'].value
    var Filter= this.form?.controls['Filter'].value
    var search= this.form?.controls['search'].value
    var filteredData:EntityModel[]
    filteredData = this.ontologyEntitiesFilter
    if(search){
      filteredData = this.ontologyEntitiesFilter.filter(x=>x.entityInfo[0].entityText.trim().includes(search.trim()))
    }
    if(Category){
      filteredData = filteredData.filter(x=>x.categoryId == Category)
    }
    if(Filter){
      if(Filter == 'filter_rev' )
        filteredData = filteredData.filter(x=>x.entityInfo[0].isReviewed == true)

      if(Filter == 'filter_no_rev' )
       filteredData = filteredData.filter(x=>x.entityInfo[0].isReviewed != true)

      if(Filter == 'filter_no_syn' )
         filteredData = filteredData.filter(x=>x.children.length < 1)

         if(Filter == 'filter_error_stem' )
         filteredData = filteredData.filter(x=>x.errorInStem == true)
    }


    this.ontologyEntities = filteredData
  }
  getFactCategories(){
    this._ontologyEntitiesService.getFactCategories(this.projectId).subscribe((res:any)=>{
      debugger
      this.factCatogeries = res.factCategories.factCategories
    })
  }

  clickOnList(entity:EntityModel, index){
    this.entityTitle = entity.entityInfo[0].entityText
    this.currentIndex = index
    this.childrenEntites = entity.children.sort((n1,n2) => {
      if (n1._id > n2._id) {
          return 1;
      }

      if (n1._id < n2._id) {
          return -1;
      }
      return 0;
  });

  }

  clickOnList2(){
    this.entityTitle = this.ontologyEntities[this.currentIndex].entityInfo[0].entityText

    this.childrenEntites = this.ontologyEntities[this.currentIndex].children.sort((n1,n2) => {
      if (n1._id > n2._id) {
          return 1;
      }

      if (n1._id < n2._id) {
          return -1;
      }
      return 0;
  });
  }

  deleteEntity(id:any){
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
          this._ontologyEntitiesService.DeleteOntologyEntities(this.projectId,this.type,id).subscribe((res:any)=>{
            if(res.status == 1){
              this.notify.openSuccessSnackBar("Successfully deleted")
              this.reloadEntiesFlage = true
              this.getEntities()
            }
          })
        }
      })
  }

  setIsType(entity:EntityModel){
    debugger
    this._ontologyEntitiesService.setIsType(this.projectId,entity._id,entity.frame.isType).subscribe((res:any)=>{
      if(res.status == 1){
        this.notify.openSuccessSnackBar("Successfylly Edited")
      }
    })
  }

  setNegative(entity:EntityModel){
    debugger
    this._ontologyEntitiesService.setNegative(this.projectId,entity._id,entity.frame.negative).subscribe((res:any)=>{
      if(res.status == 1){
        this.notify.openSuccessSnackBar("Successfylly Edited")
      }
    })
  }

  setInformative(entity:EntityModel){
    debugger
    this._ontologyEntitiesService.setInformative(this.projectId,entity._id,entity.frame.Informative).subscribe((res:any)=>{
      if(res.status == 1){
        this.notify.openSuccessSnackBar("Successfylly Edited")
      }
    })
  }
  SetIgnoreTellAbout(entity:EntityModel){
    debugger
    this._ontologyEntitiesService.SetIgnoreTellAbout(this.projectId,entity._id,entity.frame.ignoreTellAbout).subscribe((res:any)=>{
      if(res.status == 1){
        this.notify.openSuccessSnackBar("Successfylly Edited")
      }
    })
  }

  setAmbClass(entity:EntityModel){
    debugger
    this._ontologyEntitiesService.setAmbClass(this.projectId,entity._id,entity.ambClass).subscribe((res:any)=>{
      if(res.status == 1){
        this.notify.openSuccessSnackBar("Successfylly Edited")
      }
    })
  }

  setTriggerEntity(entity:EntityModel){
    debugger
    this._ontologyEntitiesService.setTriggerEntity(this.projectId,entity._id,entity.trigger).subscribe((res:any)=>{
      if(res.status == 1){
        this.notify.openSuccessSnackBar("Successfylly Edited")
      }
    })
  }

  setTalkAboutMenu(entity:EntityModel){
    debugger
    this._ontologyEntitiesService.setTalkAboutMenu(this.projectId,entity._id,entity.talkAboutMenu).subscribe((res:any)=>{
      if(res.status == 1){
        this.notify.openSuccessSnackBar("Successfylly Edited")
      }
    })
  }
  setFemale(entity:EntityModel){
    debugger
    this._ontologyEntitiesService.setFemale(this.projectId,entity._id,entity.female).subscribe((res:any)=>{
      if(res.status == 1){
        this.notify.openSuccessSnackBar("Successfylly Edited")
      }
    })
  }

  editIsReviewed(entity:EntityModel){
    debugger
    this._ontologyEntitiesService.EditIsReviewed(this.projectId,entity).subscribe((res:any)=>{
      if(res.status == 1){
        this.notify.openSuccessSnackBar("Successfylly Edited")
      }
    })
  }
  openCatogeryIdDialog(entity:EntityModel){
    const dialogRef = this.dialog.open(SelectFactCategoryComponent, {
      data: { category:this.factCatogeries , entity: entity ,projectId:this.projectId}, maxHeight: '730px',
      width: '900px'
    },
    );
    dialogRef.afterClosed().subscribe((res:any) => {
      if(res){
        var index = this.ontologyEntities.findIndex(x=>x._id == res.entityId)
        this.ontologyEntities[index].categoryId = res.categoryId
      }
    })
  }

  openRelatedFramesAndEligible(entity:EntityModel){
    debugger
    const dialogRef = this.dialog.open(ShowRealtedFramesAndEligibleComponent, {
      data: { senseId:entity.senseId},},
    );
    dialogRef.afterClosed().subscribe((res:any) => {
    })
  }
  openRelatedFrames(entity:EntityModel){
    debugger
    const dialogRef = this.dialog.open(ShowRelatedFramesComponent, {
      data: { senseId:entity.senseId},},
    );
    dialogRef.afterClosed().subscribe((res:any) => {
    })
  }

  setArgumentMapping(entity:any){
    const dialogRef = this.dialog.open(ArgumentMappingComponent, {
      data: { entityId:entity._id,cmp:entity.cmp,sbj:entity.sbj,obj:entity.obj,features:entity.features, projectId:this.projectId,},},
    );
    dialogRef.afterClosed().subscribe((res:any) => {
      if(res)
        {this.reloadEntiesFlage = true
          if(this.type == 'gneratedFrames'){
            this.getGeneratedEntities()
          }
          else{
            this.getEntities()
          }
        }
    })
  }

  openShowEntityBehavior(entity:EntityModel){
    const dialogRef = this.dialog.open(EntityBehaviorComponent, {
      data: { projectId:this.projectId, entityId:entity._id, ontologyEntities:this.ontologyEntities},},
    );
    dialogRef.afterClosed().subscribe((res:any) => {
    })
  }

  openShowDeconstructClass(entity:EntityModel){
    const dialogRef = this.dialog.open(DeconstructClassComponent, {
      data: { projectId:this.projectId, entityId:entity._id, ontologyEntities:this.ontologyEntities},},
    );
    dialogRef.afterClosed().subscribe((res:any) => {
    })
  }

  openCreateEntity(){
   let entityId = this.ontologyEntities[this.currentIndex]._id
    const dialogRef = this.dialog.open(CreateOntologyEntityComponent, {
      data: {entityId:entityId, projectId:this.projectId,mode:'Synonym' , Type:this.type},},
    );
    dialogRef.afterClosed().subscribe((res:any) => {
      if(res)
        {this.reloadEntiesFlage = true
          if(this.type == 'gneratedFrames'){
            this.getGeneratedEntities()
          }
          else{
            this.getEntities()
          }
        }
    })
  }

  editFrame(entity:EntityModel){
    debugger
    let verb = entity.verb != null ? entity.verb : entity.entityInfo[0].stemmedEntity.split(" ")[0]
    this.router.navigate([`/projects/${this.projectId}/EditFrame/${verb}/${entity._id}/1`])
  }
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }


}
