import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ProjectsRoutingModule } from "./projects-routing.module";
import { ProjectsComponent } from "./projects.component";
import { ProjectCreateUpdateModule } from "./components/project-create-update/project-create-update.module";
import { SharedModule } from "src/app/shared/shared.module";
import { ToolbarUserModule } from "src/@vex/layout/toolbar/toolbar-user/toolbar-user.module";
import { ProjectsCardComponent } from "./components/projects-card/projects-card.component";
import { ProjectRoutelet } from "./pages/project.routelet";
import { HomePage } from "./pages/home/home.page";
import { ProjectDetailsPage } from "./pages/project-details/project-details.page";
import { TranslateModule } from "@ngx-translate/core";
import { SharedanaylaticsComponent } from "./anaylatics/anaylatics/analytic-components/anaylatics-overview/sharedanaylatics/sharedanaylatics.component";
import { WidgetQuickLineChartModule } from "src/@vex/components/widgets/widget-quick-line-chart/widget-quick-line-chart.module";
import { WidgetQuickValueCenterModule } from "src/@vex/components/widgets/widget-quick-value-center/widget-quick-value-center.module";
import { AnaylaticsOverviewComponent } from "./anaylatics/anaylatics/analytic-components/anaylatics-overview/anaylatics-overview.component";
import { ChatbotConversationComponent } from "./anaylatics/anaylatics/analytic-components/anaylatics-overview/chatbot-conversation/chatbot-conversation.component";
import { WidgetLargeChartModule } from "src/@vex/components/widgets/widget-large-chart/widget-large-chart.module";
import { DialogChatBotConversationComponent } from "./anaylatics/anaylatics/analytic-components/anaylatics-overview/dialog-chat-bot-conversation/dialog-chat-bot-conversation.component";
import { AgentconversationComponent } from "./anaylatics/anaylatics/analytic-components/anaylatics-overview/agentconversation/agentconversation.component";
import { SurveyComponent } from "./anaylatics/anaylatics/analytic-components/anaylatics-overview/survey/survey.component";
import { DialogStatisticalReportComponent } from "./anaylatics/anaylatics/analytic-components/anaylatics-overview/dialog-statistical-report/dialog-statistical-report.component";
import { GptConversationComponent } from "./anaylatics/anaylatics/analytic-components/anaylatics-overview/gpt-conversation/gpt-conversation.component";
import { LeadgenerationComponent } from "./anaylatics/anaylatics/analytic-components/anaylatics-overview/leadgeneration/leadgeneration.component";
import { IntegrationsComponent } from './intergration/integrations/integrations.component';
import { DialogUsersChannelsComponent } from './intergration/dialog-users-channels/dialog-users-channels.component';
import { SharedOptionsComponent } from './options/shared-options/shared-options.component';
import { GeneralComponent } from './options/components/general/general.component';
import { LanguagesComponent } from './options/components/languages/languages.component';
import { ServicesComponent } from './options/components/services/services.component';
import { LoginComponent } from './options/components/login/login.component';
import { LiveChatEscalationComponent } from './options/components/live-chat-escalation/live-chat-escalation.component';
import { DialogAddDmainAndClientEntityComponent } from './options/components/general/dialog-add-dmain-and-client-entity/dialog-add-dmain-and-client-entity.component';
import { MediaBaseURLComponent } from './options/components/media-base-url/media-base-url.component';
import { StaticResponseComponent } from './options/components/static-response/static-response.component';
import { ResponseFooterComponent } from './options/components/response-footer/response-footer.component';
import { FactCategoriesComponent } from './options/components/fact-categories/fact-categories.component';
import { ScrollbarModule } from "src/@vex/components/scrollbar/scrollbar.module";
import { DialogAddClientEntityComponent } from './options/components/general/dialog-add-client-entity/dialog-add-client-entity.component';
import { WidgetControlsComponent } from './Widget/widget-setup/widget-controls/widget-controls.component';
import { DeleteThemeComponent } from './Widget/widget-setup/widget-controls/delete-theme/delete-theme.component';
import { CreateNewThemeComponent } from './Widget/widget-setup/widget-controls/create-new-theme/create-new-theme.component';
import { WidegtPreviewComponent } from './Widget/widget-setup/widegt-preview/widegt-preview.component';
import { FormsModule } from "@angular/forms";
import { MagicWordWriteComponent } from "src/app/shared/components/magic-word-write/magic-word-write.component";
import { CreateWorkSpaceComponent } from './components/create-work-space/create-work-space.component';
import { ProjectWidgetComponent } from './sharedWidget/project-widget/project-widget.component';
import { ServiceInfoComponent } from "./build/build-services/service-info/service-info.component";
import { ServicesCreateComponent } from "./build/build-services/services-create/services-create.component";
import { ServicesSetComponent } from "./build/build-services/services-set/services-set.component";
import { VariablesComponent } from './build/build-variables/variables/variables.component';
import { VariableCreateEditComponent } from './build/build-variables/variable-create-edit/variable-create-edit.component';
import { DisplayFieldComponent } from './build/build-variables/display-field/display-field.component';
import { DataTypesComponent } from './build/build-dataTypes/data-types/data-types.component';
import { SystemEntitiesComponent } from './build/build-dataTypes/system-entities/system-entities.component';
import { EntitiesComponent } from './build/build-dataTypes/entities/entities.component';
import { MenusComponent } from './build/build-dataTypes/menus/menus.component';
import { ClassesComponent } from './build/build-dataTypes/classes/classes.component';
import { SecondaryToolbarModule } from "src/@vex/components/secondary-toolbar/secondary-toolbar.module";
import { SharedSurveyComponent } from "./anaylatics/anaylatics/analytic-components/anaylatics-overview/__survey/shared-survey/shared-survey.component";
import { SurveyDetailsComponent } from "./anaylatics/anaylatics/analytic-components/anaylatics-overview/__survey/survey-details/survey-details.component";
import { UpdateImagePathComponent } from "./Widget/widget-setup/update-image-path/update-image-path.component";
import { WidgetSetupComponent } from "./Widget/widget-setup/widget-setup.component";
import { TestComponent } from './test/test/test.component';
import { TreeViewComponent } from './test/Tree/tree-view/tree-view.component';
import { WheelDirective } from './test/Tree/wheel.directive';
import { GeneratedEntityInfoComponent } from './test/generated-entity-info/generated-entity-info.component';
import { MainTaskParentComponent } from './build/_build-tasks/main_parent/main-task-parent/main-task-parent.component';
import { AddBreBuildBotComponent } from './build/_build-tasks/add-bre-build-bot/add-bre-build-bot.component';
import { BuildTriggeredTasksComponent } from './build/build-triggered-tasks/build-triggered-tasks.component';
import { CustomLineBreakerPipe } from "src/app/shared/custom-line-breaker.pipe";
import { EntitiesCreateComponent } from './build/build-dataTypes/entities/entities-create/entities-create.component';
import { EntitiesInfoComponent } from './build/build-dataTypes/entities/entities-info/entities-info.component';
import { ClassCreateComponent } from './build/build-dataTypes/classes/class-create/class-create.component';
import { ClassInfoComponent } from './build/build-dataTypes/classes/class-info/class-info.component';
import { ClickOutsideModule } from 'ng-click-outside';
import { CreateTaskComponent } from './build/_build-tasks/create-task/create-task.component';
import { ImportTaskComponent } from './build/_build-tasks/import-task/import-task.component';
import { ParentTaskEditOptionsComponent } from './build/_build-tasks/--task-edit-static-and-flow/parent-task-edit-options/parent-task-edit-options.component';
import { TaskSettingsComponent } from './build/_build-tasks/--task-edit-static-and-flow/task-settings/task-settings.component';
import { MenusCreateComponent } from './build/build-dataTypes/menus/menus-create/menus-create.component';
import { MenusInfoComponent } from './build/build-dataTypes/menus/menus-info/menus-info.component';
import { TreeModule } from "@circlon/angular-tree-component";
import { MenuAddComponent } from './build/build-dataTypes/menus/menu-add/menu-add.component';
import { MenuEditComponent } from './build/build-dataTypes/menus/menu-edit/menu-edit.component';
import { MenuDeleteComponent } from './build/build-dataTypes/menus/menu-delete/menu-delete.component';
import { DragDropModule } from "@angular/cdk/drag-drop";
import { QuillModule } from "ngx-quill";
import { ScrollingModule } from '@angular/cdk/scrolling';


import { IntentsComponent } from './build/_build-tasks/--task-edit-static-and-flow/intents/intents.component';
import { MainTAskCoditionComponent } from './build/_build-tasks/--task-edit-static-and-flow/task-settings/main-task-codition/main-task-codition.component';
import { TaskStaticResponseComponent } from './build/_build-tasks/--task-edit-static-and-flow/task-static-response/task-static-response.component';
import { DiagramflowIframComponent } from './build/_build-tasks/--task-edit-static-and-flow/diagramflow-ifram/diagramflow-ifram.component';
import { ParentOntologyEntitiesComponent } from './knowledge/ontology-entities/parent-ontology-entities/parent-ontology-entities.component';
import { OntologyEntitiesComponent } from './knowledge/ontology-entities/parent-ontology-entities/ontology-entities/ontology-entities.component';
import { FramesComponent } from './knowledge/ontology-entities/parent-ontology-entities/ontology-entities/components/frames/frames.component';
import { OntologyConditionsComponent } from './knowledge/ontology-entities/parent-ontology-entities/ontology-entities/components/ontology-conditions/ontology-conditions.component';
import { OntologyIndividualsComponent } from './knowledge/ontology-entities/parent-ontology-entities/ontology-entities/components/ontology-individuals/ontology-individuals.component';
import { OntologyRestrictedPropertiesComponent } from './knowledge/ontology-entities/parent-ontology-entities/ontology-entities/components/ontology-restricted-properties/ontology-restricted-properties.component';
import { OntologyQuestionToolsComponent } from './knowledge/ontology-entities/parent-ontology-entities/ontology-entities/components/ontology-question-tools/ontology-question-tools.component';
import { OntologyAdverbsComponent } from './knowledge/ontology-entities/parent-ontology-entities/ontology-entities/components/ontology-adverbs/ontology-adverbs.component';
import { OntologyPropVpComponent } from './knowledge/ontology-entities/parent-ontology-entities/ontology-entities/components/ontology-prop-vp/ontology-prop-vp.component';
import { OntologyFactPorpertyComponent } from './knowledge/ontology-entities/parent-ontology-entities/ontology-entities/components/ontology-fact-porperty/ontology-fact-porperty.component';
import { OntologyAdjectivesComponent } from './knowledge/ontology-entities/parent-ontology-entities/ontology-entities/components/ontology-adjectives/ontology-adjectives.component';
import { OntologyGeneratedFramesComponent } from './knowledge/ontology-entities/parent-ontology-entities/ontology-entities/components/ontology-generated-frames/ontology-generated-frames.component';
import { SharedEntityTableComponent } from './knowledge/ontology-entities/parent-ontology-entities/ontology-entities/components/shared-entity-table/shared-entity-table.component';
import { OntologyClassesComponent } from "./knowledge/ontology-entities/parent-ontology-entities/ontology-entities/components/classes/classes.component";
import { SelectFactCategoryComponent } from './knowledge/ontology-entities/parent-ontology-entities/ontology-entities/dialogs/select-fact-category/select-fact-category.component';
import { ShowRelatedFramesComponent } from './knowledge/ontology-entities/parent-ontology-entities/ontology-entities/dialogs/show-related-frames/show-related-frames.component';
import { KnowlegeGraphComponent } from './knowledge/knowlege-graph/knowlege-graph.component';
import { LanguageToolsComponent } from './knowledge/language-tools/language-tools.component';
import { UniqueDomainStemsComponent } from './knowledge/language-tools/unique-domain-stems/unique-domain-stems.component';
import { OntologyTreeComponent } from './knowledge/ontology-tree/ontology-tree.component';
import { OntologyTreeChildComponent } from './knowledge/ontology-tree/ontology-tree-child/ontology-tree-child.component';
import { OntologyTreeStructureComponent } from './knowledge/ontology-tree/ontology-tree-child/ontology-tree-structure/ontology-tree-structure.component';
import { AddChildDialogComponent } from './knowledge/ontology-tree/ontology-tree-child/ontology-tree-structure/add-child-dialog/add-child-dialog.component';
import { AddVerbsDialogComponent } from './knowledge/ontology-tree/ontology-tree-child/ontology-tree-structure/add-verbs-dialog/add-verbs-dialog.component';
import { AddNodeSiblingComponent } from './knowledge/ontology-tree/ontology-tree-child/ontology-tree-structure/add-node-sibling/add-node-sibling.component';
import { DeleteOntologyNodeComponent } from './knowledge/ontology-tree/ontology-tree-child/ontology-tree-structure/delete-ontology-node/delete-ontology-node.component';
import { ShowRealtedFramesAndEligibleComponent } from './knowledge/ontology-entities/parent-ontology-entities/ontology-entities/dialogs/show-realted-frames-and-eligible/show-realted-frames-and-eligible.component';
import { ArgumentMappingComponent } from './knowledge/ontology-entities/parent-ontology-entities/ontology-entities/dialogs/argument-mapping/argument-mapping.component';
import { EntityBehaviorComponent } from './knowledge/ontology-entities/parent-ontology-entities/ontology-entities/dialogs/entity-behavior/entity-behavior.component';
import { DeconstructClassComponent } from './knowledge/ontology-entities/parent-ontology-entities/ontology-entities/dialogs/deconstruct-class/deconstruct-class.component';
import { CreateOntologyEntityComponent } from './knowledge/ontology-entities/parent-ontology-entities/ontology-entities/dialogs/create-ontology-entity/create-ontology-entity.component';
import { ParentEditFrameComponent } from './knowledge/ontology-entities/parent-ontology-entities/ontology-entities/edit-frame/parent-edit-frame/parent-edit-frame.component';
import { SelectedEntityFrameComponent } from './knowledge/ontology-entities/parent-ontology-entities/ontology-entities/edit-frame/parent-edit-frame/selected-entity-frame/selected-entity-frame.component';
import { AllEntityFramesComponent } from './knowledge/ontology-entities/parent-ontology-entities/ontology-entities/edit-frame/parent-edit-frame/all-entity-frames/all-entity-frames.component';
import { AllEntitiesComponent } from './knowledge/ontology-entities/parent-ontology-entities/ontology-entities/edit-frame/parent-edit-frame/all-entities/all-entities.component';
import { AddFrameAttachmentComponent } from './knowledge/ontology-entities/parent-ontology-entities/ontology-entities/edit-frame/parent-edit-frame/selected-entity-frame/add-frame-attachment/add-frame-attachment.component';
import { AddclassAsvalueComponent } from './knowledge/ontology-entities/parent-ontology-entities/ontology-entities/edit-frame/parent-edit-frame/selected-entity-frame/addclass-asvalue/addclass-asvalue.component';
import { AddNewSenseComponent } from './knowledge/ontology-entities/parent-ontology-entities/ontology-entities/edit-frame/parent-edit-frame/selected-entity-frame/add-new-sense/add-new-sense.component';
import { ReplaceSenseComponent } from './knowledge/ontology-entities/parent-ontology-entities/ontology-entities/edit-frame/parent-edit-frame/selected-entity-frame/replace-sense/replace-sense.component';
import { ShowENComponent } from './knowledge/ontology-entities/parent-ontology-entities/ontology-entities/edit-frame/parent-edit-frame/selected-entity-frame/show-en/show-en.component';
import { ParentOntolgyTreeComponent } from './knowledge/-ontolgyTree/parent-ontolgy-tree/parent-ontolgy-tree.component';
import { OntolgyTreeViewComponent } from './knowledge/-ontolgyTree/parent-ontolgy-tree/ontolgy-tree-view/ontolgy-tree-view.component';
import { AddSibblingAndChildComponent } from './knowledge/-ontolgyTree/parent-ontolgy-tree/ontolgy-tree-view/add-sibbling-and-child/add-sibbling-and-child.component';
import { AddVerbComponent } from './knowledge/-ontolgyTree/parent-ontolgy-tree/ontolgy-tree-view/add-verb/add-verb.component';
import { SetImpliedComponent } from './knowledge/-ontolgyTree/parent-ontolgy-tree/ontolgy-tree-view/set-implied/set-implied.component';
import { FactPropertyTreeComponent } from './knowledge/-ontolgyTree/fact-property-tree/fact-property-tree.component';
import { AddSubCmpObjComponent } from './knowledge/-ontolgyTree/fact-property-tree/add-sub-cmp-obj/add-sub-cmp-obj.component';
import { AddFrameAttchPropertyComponent } from './knowledge/-ontolgyTree/fact-property-tree/add-frame-attch-property/add-frame-attch-property.component';
import { ManageAttachedFramesComponent } from './knowledge/-ontolgyTree/fact-property-tree/manage-attached-frames/manage-attached-frames.component';
import { AttachedFrameListComponent } from './knowledge/-ontolgyTree/fact-property-tree/attached-frame-list/attached-frame-list.component';
import { TreeNodeDetailsComponent } from './knowledge/-ontolgyTree/fact-property-tree/tree-node-details/tree-node-details.component';
import { AddIndividualClassFrameComponent } from './knowledge/-ontolgyTree/fact-property-tree/tree-node-details/add-individual-class-frame/add-individual-class-frame.component';
import { ViewOntologyIntentsComponent } from './knowledge/-ontolgyTree/parent-ontolgy-tree/view-ontology-intents/view-ontology-intents.component';
import { ParentPropertyTreeComponent } from './knowledge/properties/parent-property-tree/parent-property-tree.component';
import { PropertyTreeViewComponent } from './knowledge/properties/parent-property-tree/property-tree-view/property-tree-view.component';
import { AddSibblingAndChildPropertyComponent } from './knowledge/properties/parent-property-tree/add-sibbling-and-child-property/add-sibbling-and-child-property.component';
import { AddSynonumComponent } from './knowledge/properties/parent-property-tree/add-synonum/add-synonum.component';
import { AddDomainPropertyComponent } from './knowledge/properties/parent-property-tree/add-domain-property/add-domain-property.component';
import { SortDomainsComponent } from './knowledge/properties/parent-property-tree/sort-domains/sort-domains.component';
import { ReplacePropertyComponent } from './knowledge/properties/parent-property-tree/replace-property/replace-property.component';
import { KnowledgeTaskComponent } from "./knowledge/knowledge-tasks/knowledge-task.component";
import { UniqueVerbsComponent } from './knowledge/language-tools/unique-verbs/unique-verbs.component';
import { LinkedToFactComponent } from './knowledge/knowledge-tasks/linked-to-fact/linked-to-fact.component';
import { KnowledgeTaskstaticResponseComponent } from './knowledge/knowledge-tasks/knowledge-taskstatic-response/knowledge-taskstatic-response.component';
import { ExtractEntitiesByAiComponent } from './entities-Ai/extract-entities-by-ai/extract-entities-by-ai.component';
import { AiConversationComponent, ParseDatePipe } from './ai-conversation/ai-conversation/ai-conversation.component';
import { BrainComponent } from './options/components/brain/brain.component';
import { AgentToolsComponent } from './ai-conversation/AI-Agent/agent-tools/agent-tools.component';
import { AgentsComponent } from './ai-conversation/AI-Agent/agents/agents.component';
import { ConfirmDialoDeleteComponent } from "src/app/shared/components/confirm-dialo-delete/confirm-dialo-delete.component";
import { KnowledgeBaseBuildComponent } from './ai-conversation/build-knowlege-base/knowledge-base-Build/knowledge-base.component';
import { UploadDialogComponent } from './ai-conversation/build-knowlege-base/dialogs/upload-dialog/upload-dialog.component';
import { PlainTextDialogComponent } from './ai-conversation/build-knowlege-base/dialogs/plain-text-dialog/plain-text-dialog.component';
import { UrlsDialogComponent } from './ai-conversation/build-knowlege-base/dialogs/urls-dialog/urls-dialog.component';
import { KnolwlgeBaseTableComponent } from './ai-conversation/build-knowlege-base/knolwlge-base-table/knolwlge-base-table.component';
import { ShowContentComponent } from "./ai-conversation/build-knowlege-base/dialogs/show-content/show-content.component";
import { AiConversationFilterDialogComponent } from './ai-conversation/ai-conversation/ai-conversation-filter-dialog/ai-conversation-filter-dialog.component';
import { ParentKnowledgeBaseComponent } from './Ai-build-veba-Knowledge-Base/parent-knowledge-base/parent-knowledge-base.component';
import { ImportDataComponent } from './Ai-build-veba-Knowledge-Base/components/import-data/import-data.component';
import { DocumentsComponent } from './Ai-build-veba-Knowledge-Base/components/documents/documents.component';
import { IndexDetailsComponent } from './Ai-build-veba-Knowledge-Base/components/index-details/index-details.component';
import { ChatComponent } from "./Ai-build-veba-Knowledge-Base/components/Chat/chat.component";
import { SettingsComponent } from './Ai-build-veba-Knowledge-Base/components/settings/settings.component';

@NgModule({
  declarations: [
    ParseDatePipe,
    CustomLineBreakerPipe,
    ProjectsComponent,
    ProjectsCardComponent,
    ProjectRoutelet,
    HomePage,
    ProjectDetailsPage,
    SharedanaylaticsComponent,
    AnaylaticsOverviewComponent,
    ChatbotConversationComponent,
    DialogChatBotConversationComponent,
    AgentconversationComponent,
    SurveyComponent,
    DialogStatisticalReportComponent,
    GptConversationComponent,
    LeadgenerationComponent,
    IntegrationsComponent,
    DialogUsersChannelsComponent,
    SharedOptionsComponent,
    GeneralComponent,
    LanguagesComponent,
    ServicesComponent,
    LoginComponent,
    LiveChatEscalationComponent,
    DialogAddDmainAndClientEntityComponent,
    MediaBaseURLComponent,
    StaticResponseComponent,
    ResponseFooterComponent,
    FactCategoriesComponent,
    DialogAddClientEntityComponent,
    WidgetControlsComponent,
    DeleteThemeComponent,
    CreateNewThemeComponent,
    MagicWordWriteComponent,
    CreateWorkSpaceComponent,
    ProjectWidgetComponent,
    ServicesSetComponent,
    ServiceInfoComponent,
    ServicesCreateComponent,
    VariablesComponent,
    VariableCreateEditComponent,
    DisplayFieldComponent,
    DataTypesComponent,
    SystemEntitiesComponent,
    EntitiesComponent,
    MenusComponent,
    ClassesComponent,
    SharedSurveyComponent,
    SurveyDetailsComponent,
    WidgetSetupComponent,
    WidgetControlsComponent,
    DeleteThemeComponent,
    CreateNewThemeComponent,
    WidegtPreviewComponent,
    UpdateImagePathComponent,
    TestComponent,
    TreeViewComponent,
    WheelDirective,
    GeneratedEntityInfoComponent,
    MainTaskParentComponent,
    AddBreBuildBotComponent,
    BuildTriggeredTasksComponent,
    EntitiesCreateComponent,
    EntitiesInfoComponent,
    ClassCreateComponent,
    ClassInfoComponent,
    CreateTaskComponent,
    ImportTaskComponent,
    ParentTaskEditOptionsComponent,
    TaskSettingsComponent,
    MenusCreateComponent,
    MenusInfoComponent,
    MenuAddComponent,
    MenuEditComponent,
    MenuDeleteComponent,
    IntentsComponent,
    MainTAskCoditionComponent,
    TaskStaticResponseComponent,
    DiagramflowIframComponent,
    ParentOntologyEntitiesComponent,
    OntologyEntitiesComponent,
    FramesComponent,
    OntologyConditionsComponent,
    OntologyIndividualsComponent,
    OntologyRestrictedPropertiesComponent,
    OntologyQuestionToolsComponent,
    OntologyAdverbsComponent,
    OntologyPropVpComponent,
    OntologyFactPorpertyComponent,
    OntologyAdjectivesComponent,
    OntologyGeneratedFramesComponent,
    SharedEntityTableComponent,
    OntologyClassesComponent,
    SelectFactCategoryComponent,
    ShowRelatedFramesComponent,
    KnowlegeGraphComponent,
    LanguageToolsComponent,
    UniqueDomainStemsComponent,
    OntologyTreeComponent,
    OntologyTreeChildComponent,
    OntologyTreeStructureComponent,
    AddChildDialogComponent,
    AddVerbsDialogComponent,
    AddNodeSiblingComponent,
    DeleteOntologyNodeComponent,
    ShowRealtedFramesAndEligibleComponent,
    ArgumentMappingComponent,
    EntityBehaviorComponent,
    DeconstructClassComponent,
    CreateOntologyEntityComponent,
    ParentEditFrameComponent,
    SelectedEntityFrameComponent,
    AllEntityFramesComponent,
    AllEntitiesComponent,
    AddFrameAttachmentComponent,
    AddclassAsvalueComponent,
    AddNewSenseComponent,
    ReplaceSenseComponent,
    ShowENComponent,
    ParentOntolgyTreeComponent,
    OntolgyTreeViewComponent,
    AddSibblingAndChildComponent,
    AddVerbComponent,
    SetImpliedComponent,
    FactPropertyTreeComponent,
    AddSubCmpObjComponent,
    AddFrameAttchPropertyComponent,
    ManageAttachedFramesComponent,
    AttachedFrameListComponent,
    TreeNodeDetailsComponent,
    AddIndividualClassFrameComponent,
    ViewOntologyIntentsComponent,
    ParentPropertyTreeComponent,
    PropertyTreeViewComponent,
    AddSibblingAndChildPropertyComponent,
    AddSynonumComponent,
    AddDomainPropertyComponent,
    SortDomainsComponent,
    ReplacePropertyComponent,
    KnowledgeTaskComponent,
    UniqueVerbsComponent,
    LinkedToFactComponent,
    KnowledgeTaskstaticResponseComponent,
    ExtractEntitiesByAiComponent,
    AiConversationComponent,
    BrainComponent,
    AgentToolsComponent,
    AgentsComponent,
    ConfirmDialoDeleteComponent,
    KnowledgeBaseBuildComponent,
    UploadDialogComponent,
    PlainTextDialogComponent,
    UrlsDialogComponent,
    KnolwlgeBaseTableComponent,
    ShowContentComponent,
    AiConversationFilterDialogComponent,
    ParentKnowledgeBaseComponent,
    ImportDataComponent,
    DocumentsComponent,
    ChatComponent,
    IndexDetailsComponent,
    SettingsComponent
  ],
  imports: [
    TreeModule,
    CommonModule,
    ProjectsRoutingModule,
    ProjectCreateUpdateModule,
    ToolbarUserModule,
    SharedModule,
    TranslateModule,
    WidgetQuickLineChartModule,
    WidgetLargeChartModule,
    ScrollbarModule,
    FormsModule,
    SecondaryToolbarModule,
    ClickOutsideModule,
    DragDropModule,
    ScrollingModule,
    QuillModule.forRoot({
      modules: {
        toolbar: [
          [{ 'list': 'ordered' }, { 'list': 'bullet' }], // Ordered and unordered list options
          [{ 'direction': 'rtl' }], // Right-to-left text direction option
        ]
      }
    })

  ],
})
export class ProjectsModule { }
