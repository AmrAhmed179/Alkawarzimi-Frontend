import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { ECOTree } from '../econode';

@Component({
  selector: 'vex-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss']
})
export class TreeViewComponent implements OnInit {

  @Input() template: TemplateRef<any>;
  @Input() set data(value){
     this.tree=new ECOTree();
     this.addNodes(this.tree,value)
     this.tree.UpdateTree();
  }
  update(){
    this.tree.UpdateTree();
  }
  get config(){
    return this.tree.config;
  }
  tree:ECOTree=new ECOTree();
  addNodes(tree:ECOTree,node:any,parent:any=null)
  {
    //debugger
    parent=parent || {id:-1,width:null,height:null,color:null,background:null,linkColor:null}
    node.width=node.width || parent.width
    node.height=node.height || parent.height
    node.color=node.color || parent.color
    node.background=node.background || parent.background
    //node.linkColor= node.linkColor || parent.linkColor
    node.linkColor= 'black'
    node.id=tree.nDatabaseNodes.length
    node.Data = {type:node.type,word:node.word,Id:node.Id,pId:node.pId,RId:node.RId,s:node.s,E:node.E,t:node.t}
      tree.add(node.id,parent.id,node.title, node.width, node.height, node.color, node.background, node.linkColor, node.Data)
      if (node.children)
      {
      node.children.forEach((x:any)=>{
        this.addNodes(tree,x,node)
      })
      }
  }
  cl(){
      console.log("lkrckrcm")
  }
  constructor() { }

  ngOnInit(): void {
  }

}
