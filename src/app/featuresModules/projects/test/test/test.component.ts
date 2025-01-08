import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { TestService } from 'src/app/Services/test.service';
import { DataService } from 'src/app/core/services/data.service';
import { NotifyService } from 'src/app/core/services/notify.service';
import { IECONode, Orientation } from '../Tree/econode';
import { MatDialog } from '@angular/material/dialog';
import { GeneratedEntityInfoComponent } from '../generated-entity-info/generated-entity-info.component';
@Component({
  selector: 'vex-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  data:IECONode
  ParsingTree:any
  sortedChildsArray:any[]
  diagonsticForm:FormGroup
  patternMatchForm:FormGroup
  projectId:string
  predictTree:any
  intents:any
  entities:any[]
  diagnosticEntities:any[] = []
  qtools:any[]
  generatedEntities:any[]
  predicationsString:string
  predicationsWord:string
  intentType:string
  number:string
  tree:any[]
  rulesArray:any[] = []
  constructedArray:any[] = []
  entiityArray:any[] = []
  parentNodes:any
  constructor(private fb: FormBuilder,
    private notify: NotifyService,
    private _dataService: DataService,
    private route: ActivatedRoute,
    private _testService: TestService,
    public dialog: MatDialog) { }

    Orientation=Orientation;

  ngOnInit(): void {
    this.route.parent.params.subscribe((parmas:Params)=>{
      this.projectId = parmas["projectid"];
      this.initiateForm()
      this._testService.getِAllEntities(this.projectId).subscribe((res:any)=>{
        this.entities = res.entities
        this._testService.getِAllGeneratedEntities(this.projectId).subscribe((result:any)=>{
          this.generatedEntities = result.entities
        })
         this.qtools = res.qtools
        // const x= this.entities.find(x=>x._id == 34652)
        // if(x){
        //   debugger
        //   let d =  this.qtools.find(x=>x._id == 5453)
        // }

        debugger

      }
      )
  })
  }
  currentZoom = 1;

  onZoom(event: WheelEvent) {
    debugger
    event.preventDefault();
    const delta = event.deltaY / 100; // Adjust the zoom speed as needed

    // Limit the zoom to a specific range (e.g., 0.5 to 3)
    this.currentZoom = Math.min(Math.max(this.currentZoom + delta, 0.5), 3);
  }
  initiateForm(){
    this.diagonsticForm = this.fb.group({
      diagonsticText :['']
    })
    this.patternMatchForm = this.fb.group({
      patternMatchText :['']
    })
  }
  getdiagonsticTextValue(){
    let text = this.diagonsticForm.controls['diagonsticText'].value
    this._testService.getPredictTree(text,this.projectId,"0").subscribe((res:any)=>{
      debugger
      this.ParsingTree = res
      this.predictTree = JSON.parse(res.parsingTree)
      this.predicationsString =  this.predictTree.predications
      this.tree = this.predictTree.Tree

      this.viewTree()
      this.getPridictions()
      this.getConstructedEntites()

      this.getRules()

      debugger
       debugger

      let Entities = this.tree.filter(d=> d.RId == 0 && d.type != 'ROOT' && (d.E ==1 || d.s ==1))
      this.diagnosticEntities = []
      Entities.forEach(e => {
        let ruleId = e.type;
        if(e.Id == 0 ||e.Id == -1){
          this.diagnosticEntities.push({rule:ruleId,entityId:e.Id,entityType:'e0-1',entityInfo:e.word,generated:'0'})
        }
        let ee =  this.entities.filter(x=>x._id == e.Id)
      if(ee.length > 0){
        this.diagnosticEntities.push({rule:ruleId,entityId:ee[0]._id,entityType:ee[0].entityType,entityInfo:ee[0].entityInfo[0].entityText,generated:'0'})
        return
      }
      let eee = this.diagnosticEntities.filter(x=>x._id == e.Id)
      if(eee.length > 0){
        this.diagnosticEntities.push({rule:ruleId,entityId:eee[0]._id,entityType:eee[0].entityType,entityInfo:eee[0].entityInfo,generated:'1'})
      }
      let eeee = this.qtools.filter(x=>x._id == e.pId)
      if(eeee.length > 0){
        this.diagnosticEntities.push({rule:ruleId,entityId:e.Id,entityType:eeee[0].entityType,entityInfo:eeee[0].entityInfo[0].entityText,generated:'0'})
      }

       });
    })
  }
  setOptionInInput(value){
    this.diagonsticForm.controls['diagonsticText'].setValue(value)
    this.getdiagonsticTextValue()
  }
  diagnostic(){
    this.patternMatchForm.controls['patternMatchText'].setValue(this.diagonsticForm.controls['diagonsticText'].value)
  }
  patern(){
    this.diagonsticForm.controls['diagonsticText'].setValue(this.patternMatchForm.controls['patternMatchText'].value)
  }

  getTextResponse(response){

    let start1 = response.message.indexOf('<')
    let start2 = response.message.indexOf('>')

    if(start2)
      return response.message.substr(0,start1-1) +  response.message.substr(start2+1,response.message.length-start2)

    return response.message;
   }
  getpatternMatchTextValue(){
    let text = this.patternMatchForm.controls['patternMatchText'].value
    this._testService.getPatternMatch(text,this.projectId).subscribe((res:any)=>{
      this.intents = res.intents.intents
      debugger
    })
  }

  getConstructedEntites(){
    this.constructedArray = []
    let constructed = this.tree.filter(x=>x.E == 0 && x.s != 0 && x.t != 0 && x.RId != 0)
     constructed.forEach(e=>{
      if(e.Id == -1){
        return
      }
      let ruleId = e.type+ '_'+e.RId
      let ee =  this.entities.filter(x=>x._id == e.Id)

      if(ee.length > 0){
        this.constructedArray.push({rule:ruleId,entityId:ee[0]._id,entityType:ee[0].entityType,entityInfo:ee[0].entityInfo[0].entityText,generated:'0',type:e.type,Id:e.Id,firstChildIndex:e.firstChildIndex})
        return
      }
      let eee = this.generatedEntities.filter(x=>x._id == e.Id)
      if(eee.length > 0){
        debugger
        this.constructedArray.push({rule:ruleId,entityId:eee[0]._id,entityType:eee[0].entityType,entityInfo:eee[0],generated:'1',type:e.type,Id:e.Id,firstChildIndex:e.firstChildIndex})
      }
      let eeee = this.qtools.filter(x=>x._id == e.pId)
      if(eeee.length > 0){
        this.constructedArray.push({rule:ruleId,entityId:e.Id,entityType:eeee[0].entityType,entityInfo:eeee[0].entityInfo[0].entityText,generated:'0',type:e.type,Id:e.Id,firstChildIndex:e.firstChildIndex})
      }
     })
  }
  getPridictions(){
    debugger
    let startIndex = this.predicationsString.indexOf('$')
      let lAstIndex = this.predicationsString.indexOf('*')
      this.predicationsWord = this.predicationsString.substring(startIndex+1,lAstIndex)
      if(this.predicationsWord =='intent'){
       var arr =  this.predicationsString.split(';');
        this.intentType = arr[1].substring(0,arr[1].length-1)
        let arr2 = arr[2].split('#')
        this.number = arr2[0]
      }
  }

  getRules(){
    this.rulesArray = []
    let rules = this.tree.filter(x=>x.RId != '0')
    rules.forEach(element => {
      debugger
      let f = this.constructedArray.find(x=>x.type == element.type && x.Id == element.Id && x.firstChildIndex == element.firstChildIndex)
      if(f){
        this.rulesArray.push({text:element.type+ '_'+element.RId,num:element.RId,entityType:f.entityType})
      }
      else{
        this.rulesArray.push({text:element.type+ '_'+element.RId,num:element.RId,entityType:''})
      }
    });
    let crr = this.rulesArray
    debugger
  }
  viewTree(){
    var parsingTree = this.ParsingTree.parsingTree.replace(/(\r\n\t|\n|\r\t)/gm, "");
            var result = JSON.parse(parsingTree);

            if (!result.Tree || result.Tree.length == 0)
                return;

            var treeData = result.Tree;

            for (var j = 0; j < treeData.length; j++) {
                if (treeData[j].RId==0)
                    continue;
                treeData[j].type += "-" + treeData[j].RId;
            }

            for (var j = 0; j < treeData.length; j++) {

                //if (treeData[j].s != 1)
                  //  continue;

                treeData[j].children = this.sortChilds(treeData[j].firstChildIndex, treeData);
            }

             this.parentNodes = treeData.filter(function (el) {
                return el.parentIndex == null;
            });
            this.data = this.parentNodes[0];
            var fcfd = this.sortedChildsArray
  }
  sortChilds(firstChildIdx, treeNodes) {
    var sortedChilds = [];
    this.sortedChildsArray = sortedChilds
    if (firstChildIdx == undefined)
        return sortedChilds;
    sortedChilds.push(treeNodes[firstChildIdx]);
    var childIdx = firstChildIdx;
    while (childIdx >= 0) {
        var nextChild = treeNodes.find(function (element) {
            return element.previousSibling == childIdx;
        })
        if (nextChild) {
            sortedChilds.push(nextChild);
            childIdx = treeNodes.indexOf(nextChild);
        }
        else childIdx = undefined;
    }
    return sortedChilds;
  }

  generatedEntity(entity){
    debugger
    let e = this.entities.find(x=>x._id == entity.entityInfo.parentId)
    let parentEnityText = e.entityInfo[0].entityText

    const dialogRef = this.dialog.open(GeneratedEntityInfoComponent,{data:{entityInfo:entity,parentEnityText:parentEnityText},minWidth:'900px',minHeight:'450px'});

    dialogRef.afterClosed().subscribe(result=>{
      }
    )
    console.log("cknrjcjrcnrcjrcjnrcnj")
  }

  /////////////////////////////////drag div /////////////
  isDragging = false;
  initialX: number = 0;
  initialY: number = 0;
  left: number = 0;
  top: number = 0;

  onMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.initialX = event.clientX - this.left;
    this.initialY = event.clientY - this.top;
  }

  onMouseUp() {
    this.isDragging = false;
  }

  onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      this.left = event.clientX - this.initialX;
      this.top = event.clientY - this.initialY;
    }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    // Adjust position if the window is resized
    if (this.isDragging) {
      this.isDragging = false;
    }
  }
}
