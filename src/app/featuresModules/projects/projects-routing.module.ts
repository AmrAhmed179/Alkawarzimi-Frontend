import { EntitiesComponent } from './build/build-dataTypes/entities/entities.component';
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CustomLayoutComponent } from "src/app/shared/custom-layout/custom-layout.component";
import { HomePage } from "./pages/home/home.page";
import { ProjectDetailsPage } from "./pages/project-details/project-details.page";
import { ProjectRoutelet } from "./pages/project.routelet";
import { ProjectsComponent } from "./projects.component";
import { SharedanaylaticsComponent } from "./anaylatics/anaylatics/analytic-components/anaylatics-overview/sharedanaylatics/sharedanaylatics.component";
import { AnaylaticsOverviewComponent } from "./anaylatics/anaylatics/analytic-components/anaylatics-overview/anaylatics-overview.component";
import { LeadgenerationComponent } from "./anaylatics/anaylatics/analytic-components/anaylatics-overview/leadgeneration/leadgeneration.component";
import { SurveyComponent } from "./anaylatics/anaylatics/analytic-components/anaylatics-overview/survey/survey.component";
import { ChatbotConversationComponent } from "./anaylatics/anaylatics/analytic-components/anaylatics-overview/chatbot-conversation/chatbot-conversation.component";
import { AgentconversationComponent } from "./anaylatics/anaylatics/analytic-components/anaylatics-overview/agentconversation/agentconversation.component";
import { GptConversationComponent } from "./anaylatics/anaylatics/analytic-components/anaylatics-overview/gpt-conversation/gpt-conversation.component";
import { IntegrationsComponent } from "integration-lib";
import { SharedOptionsComponent } from "./options/shared-options/shared-options.component";
import { GeneralComponent } from "./options/components/general/general.component";
import { LanguagesComponent } from "./options/components/languages/languages.component";
import { ServicesComponent } from "./options/components/services/services.component";
import { LoginComponent } from "./options/components/login/login.component";
import { LiveChatEscalationComponent } from "./options/components/live-chat-escalation/live-chat-escalation.component";
import { MediaBaseURLComponent } from "./options/components/media-base-url/media-base-url.component";
import { ResponseFooterComponent } from "./options/components/response-footer/response-footer.component";
import { FactCategoriesComponent } from "./options/components/fact-categories/fact-categories.component";
import { StaticResponseComponent } from "./options/components/static-response/static-response.component";
import { WidgetSetupComponent } from "./Widget/widget-setup/widget-setup.component";
import { ServicesSetComponent } from "./build/build-services/services-set/services-set.component";
import { ServiceInfoComponent } from "./build/build-services/service-info/service-info.component";
import { VariablesComponent } from "./build/build-variables/variables/variables.component";
import { DataTypesComponent } from "./build/build-dataTypes/data-types/data-types.component";
import { SystemEntitiesComponent } from './build/build-dataTypes/system-entities/system-entities.component';
import { MenusComponent } from './build/build-dataTypes/menus/menus.component';
import { ClassesComponent } from './build/build-dataTypes/classes/classes.component';
import { SharedSurveyComponent } from './anaylatics/anaylatics/analytic-components/anaylatics-overview/__survey/shared-survey/shared-survey.component';
import { SurveyDetailsComponent } from './anaylatics/anaylatics/analytic-components/anaylatics-overview/__survey/survey-details/survey-details.component';
import { TestComponent } from './test/test/test.component';
import { MainTaskParentComponent } from './build/_build-tasks/main_parent/main-task-parent/main-task-parent.component';
import { BuildTriggeredTasksComponent } from './build/build-triggered-tasks/build-triggered-tasks.component';
import { EntitiesInfoComponent } from './build/build-dataTypes/entities/entities-info/entities-info.component';
import { ClassInfoComponent } from './build/build-dataTypes/classes/class-info/class-info.component';
import { CreateTaskComponent } from './build/_build-tasks/create-task/create-task.component';
import { ParentTaskEditOptionsComponent } from './build/_build-tasks/--task-edit-static-and-flow/parent-task-edit-options/parent-task-edit-options.component';
import { MenusInfoComponent } from './build/build-dataTypes/menus/menus-info/menus-info.component';
import { OntologyEntitiesComponent } from './knowledge/ontology-entities/parent-ontology-entities/ontology-entities/ontology-entities.component';
import { ParentOntologyEntitiesComponent } from './knowledge/ontology-entities/parent-ontology-entities/parent-ontology-entities.component';
import { FramesComponent } from './knowledge/ontology-entities/parent-ontology-entities/ontology-entities/components/frames/frames.component';
import { OntologyClassesComponent } from './knowledge/ontology-entities/parent-ontology-entities/ontology-entities/components/classes/classes.component';
import { OntologyConditionsComponent } from './knowledge/ontology-entities/parent-ontology-entities/ontology-entities/components/ontology-conditions/ontology-conditions.component';
import { OntologyIndividualsComponent } from './knowledge/ontology-entities/parent-ontology-entities/ontology-entities/components/ontology-individuals/ontology-individuals.component';
import { OntologyRestrictedPropertiesComponent } from './knowledge/ontology-entities/parent-ontology-entities/ontology-entities/components/ontology-restricted-properties/ontology-restricted-properties.component';
import { OntologyQuestionToolsComponent } from './knowledge/ontology-entities/parent-ontology-entities/ontology-entities/components/ontology-question-tools/ontology-question-tools.component';
import { OntologyAdverbsComponent } from './knowledge/ontology-entities/parent-ontology-entities/ontology-entities/components/ontology-adverbs/ontology-adverbs.component';
import { OntologyPropVpComponent } from './knowledge/ontology-entities/parent-ontology-entities/ontology-entities/components/ontology-prop-vp/ontology-prop-vp.component';
import { OntologyFactPorpertyComponent } from './knowledge/ontology-entities/parent-ontology-entities/ontology-entities/components/ontology-fact-porperty/ontology-fact-porperty.component';
import { OntologyAdjectivesComponent } from './knowledge/ontology-entities/parent-ontology-entities/ontology-entities/components/ontology-adjectives/ontology-adjectives.component';
import { KnowlegeGraphComponent } from './knowledge/knowlege-graph/knowlege-graph.component';
import { LanguageToolsComponent } from './knowledge/language-tools/language-tools.component';
import { UniqueDomainStemsComponent } from './knowledge/language-tools/unique-domain-stems/unique-domain-stems.component';
import { OntologyTreeChildComponent } from './knowledge/ontology-tree/ontology-tree-child/ontology-tree-child.component';
import { OntologyTreeComponent } from './knowledge/ontology-tree/ontology-tree.component';
import { OntologyGeneratedFramesComponent } from './knowledge/ontology-entities/parent-ontology-entities/ontology-entities/components/ontology-generated-frames/ontology-generated-frames.component';
import { ParentEditFrameComponent } from './knowledge/ontology-entities/parent-ontology-entities/ontology-entities/edit-frame/parent-edit-frame/parent-edit-frame.component';
import { SelectedEntityFrameComponent } from './knowledge/ontology-entities/parent-ontology-entities/ontology-entities/edit-frame/parent-edit-frame/selected-entity-frame/selected-entity-frame.component';
import { AllEntityFramesComponent } from './knowledge/ontology-entities/parent-ontology-entities/ontology-entities/edit-frame/parent-edit-frame/all-entity-frames/all-entity-frames.component';
import { AllEntitiesComponent } from './knowledge/ontology-entities/parent-ontology-entities/ontology-entities/edit-frame/parent-edit-frame/all-entities/all-entities.component';
import { ParentOntolgyTreeComponent } from './knowledge/-ontolgyTree/parent-ontolgy-tree/parent-ontolgy-tree.component';
import { OntolgyTreeViewComponent } from './knowledge/-ontolgyTree/parent-ontolgy-tree/ontolgy-tree-view/ontolgy-tree-view.component';
import { FactPropertyTreeComponent } from './knowledge/-ontolgyTree/fact-property-tree/fact-property-tree.component';
import { ViewOntologyIntentsComponent } from './knowledge/-ontolgyTree/parent-ontolgy-tree/view-ontology-intents/view-ontology-intents.component';
import { ParentPropertyTreeComponent } from './knowledge/properties/parent-property-tree/parent-property-tree.component';
import { PropertyTreeViewComponent } from './knowledge/properties/parent-property-tree/property-tree-view/property-tree-view.component';
import { KnowledgeTaskComponent } from './knowledge/knowledge-tasks/knowledge-task.component';
import { UniqueVerbsComponent } from './knowledge/language-tools/unique-verbs/unique-verbs.component';
import { ExtractEntitiesByAiComponent } from './entities-Ai/extract-entities-by-ai/extract-entities-by-ai.component';
import { AiConversationComponent } from './ai-conversation/ai-conversation/ai-conversation.component';
import { BrainComponent } from './options/components/brain/brain.component';
import { AgentToolsComponent } from './ai-conversation/AI-Agent/agent-tools/agent-tools.component';
import { AgentsComponent } from './ai-conversation/AI-Agent/agents/agents.component';
import { KnolwlgeBaseTableComponent } from './ai-conversation/build-knowlege-base/knolwlge-base-table/knolwlge-base-table.component';
import { ParentKnowledgeBaseComponent } from './Ai-build-veba-Knowledge-Base/parent-knowledge-base/parent-knowledge-base.component';
import { ImportDataComponent } from './Ai-build-veba-Knowledge-Base/components/import-data/import-data.component';
import { DocumentsComponent } from './Ai-build-veba-Knowledge-Base/components/documents/documents.component';
import { IndexDetailsComponent } from './Ai-build-veba-Knowledge-Base/components/index-details/index-details.component';
import { ChatComponent } from './Ai-build-veba-Knowledge-Base/components/Chat/chat.component';

const routes: Routes = [
  { path: "", component: ProjectsComponent },
  {
    path: ":projectid",
    component: ProjectRoutelet,
    data: {
      adminMode: false,

    },
    children: [
      {
        path: "", component: CustomLayoutComponent,
        children: [
            {
              path: 'home',  // Base path (no params)
              redirectTo: 'home/0/dialogflow',  // Redirect with defaults
              pathMatch: 'full'
            },
          { path: "home/:start/:type", component: MainTaskParentComponent, data: { breadcrumbs: ["Tasks"], } },
          { path: "createTask", component: CreateTaskComponent, data: { breadcrumbs: ["Create Task"], } },
          { path: "editTask/:intentId/:eventTask/:clickSource", component: ParentTaskEditOptionsComponent, data: { breadcrumbs: ["Create Task"], } },
          { path: "datails", component: ProjectDetailsPage },
          { path: "variables", component: VariablesComponent, data: { breadcrumbs: ['Variables'] }, },
          { path: "TriggeredTasks", component: BuildTriggeredTasksComponent, data: { breadcrumbs: ['TriggeredTasks'] }, },
          {
            path: "dataTypes", component: DataTypesComponent,
            children: [
              { path: "", redirectTo: "entities" },
              { path: "entities", component: EntitiesComponent },
              { path: "sysEntities", component: SystemEntitiesComponent, data: { breadcrumbs: ["Data Types", "System Entities"] } },
              { path: "menus", component: MenusComponent, data: { breadcrumbs: ["Data Types", "Menus"] } },
              { path: "classes", component: ClassesComponent, data: { breadcrumbs: ["Data Types", "Classes"] } }
            ]
          },
          { path: "entityEdit/:entityId", component: EntitiesInfoComponent, data: { breadcrumbs: ['entities', 'Info'] } },
          { path: "classEdit/:classId", component: ClassInfoComponent, data: { breadcrumbs: ['Classes', 'Info'] } },
          { path: "menuEdit/:menuId", component: MenusInfoComponent, data: { breadcrumbs: ['Menus', 'Info'] } },

          { path: "servicesSet", component: ServicesSetComponent, data: { breadcrumbs: ['Services Set'] }, },
          { path: "servicesSet/:serviceId", component: ServiceInfoComponent, data: { breadcrumbs: ['Services Set', 'Info'] } },

          { path: "integrations", component: IntegrationsComponent, data: { breadcrumbs: ['home', 'integrations'] } },
          {
            path: "SharedSurvey", component: SharedSurveyComponent, data: { breadcrumbs: ['home', 'Survey'] },
            children: [
              { path: "", redirectTo: "Survey" },
              { path: "Survey", component: SurveyComponent, data: { breadcrumbs: ['home', 'Survey'] } },
              { path: "SurveyDetails", component: SurveyDetailsComponent, data: { breadcrumbs: ['home', 'Survey'] } },
            ]
          },
            {path:"AiEntities", component:ExtractEntitiesByAiComponent},
          {
            path: "knowledge", component: ParentOntologyEntitiesComponent,
            children: [
              { path: "", redirectTo: "ontologyEntities" },
              {
                path: "ontologyEntities", component: OntologyEntitiesComponent, data: { breadcrumbs: ['Ontology Entities'] }, children: [
                  { path: "", redirectTo: "action" },
                  { path: "action", component: FramesComponent, data: { breadcrumbs: ['Ontology Entities', 'Frames'] } },
                  { path: "class", component: OntologyClassesComponent, data: { breadcrumbs: ['Ontology Entities', 'Classes'] } },
                  { path: "condation", component: OntologyConditionsComponent, data: { breadcrumbs: ['Ontology Entities', 'Conditions'] } },
                  { path: "individual", component: OntologyIndividualsComponent, data: { breadcrumbs: ['Ontology Entities', 'Individuals'] } },
                  { path: "prop", component: OntologyRestrictedPropertiesComponent, data: { breadcrumbs: ['Ontology Entities', 'RestrictedProperties'] } },
                  { path: "ques_tool", component: OntologyQuestionToolsComponent, data: { breadcrumbs: ['Ontology Entities', 'QuestionTools'] } },
                  { path: "adverb", component: OntologyAdverbsComponent, data: { breadcrumbs: ['Ontology Entities', 'Adverbs'] } },
                  { path: "propVp", component: OntologyAdverbsComponent, data: { breadcrumbs: ['Ontology Entities', 'PropVp'] } },
                  { path: "factprop", component: OntologyPropVpComponent, data: { breadcrumbs: ['Ontology Entities', 'FactPorperty'] } },
                  { path: "Adjective", component: OntologyFactPorpertyComponent, data: { breadcrumbs: ['Ontology Entities', 'Adjectives'] } },
                  { path: "GeneratedFrames", component: OntologyGeneratedFramesComponent, data: { breadcrumbs: ['Ontology Entities', 'GeneratedFrames'] } },
                ]
              },
            ]
          },
          { path: "EditFrame/:Verb/:entityId/:returnPage", component: ParentEditFrameComponent, data: { breadcrumbs: ['EditFrame'] }, children:[
            { path: "", redirectTo: "SelectedFrame" },
            { path: "SelectedFrame", component: SelectedEntityFrameComponent, data: { breadcrumbs: ['EditFrame', 'Selected Frame'] } },
            { path: "AllFrames", component: AllEntityFramesComponent, data: { breadcrumbs: ['EditFrame', 'All Frames'] } },
            { path: "AllEntities", component: AllEntitiesComponent, data: { breadcrumbs: ['EditFrame', 'All Entities'] } },

          ] },
          { path: "FactTree/:entityId", component: FactPropertyTreeComponent, data: { breadcrumbs: ['Ontology Tree'] } },
          { path: "knowledgeGraph", component: KnowlegeGraphComponent, data: { breadcrumbs: ['Knowledge Graph', 'Graph'] } },
          {
            path: "languageTools", component: LanguageToolsComponent, children: [
              { path: "", redirectTo: "uniqueStems" },
              { path: "uniqueStems", component: UniqueDomainStemsComponent, data: { breadcrumbs: ['Unique Domain stems'] } },
              { path: "uniqueVerbs", component: UniqueVerbsComponent, data: { breadcrumbs: ['Unique Verbs'] } }
            ]
          },
          {
            path: "ontologyTree", component: ParentOntolgyTreeComponent, children: [
              { path: "", redirectTo: "ontologyTreeView" },
              { path: "ontologyTreeView", component: OntolgyTreeViewComponent, data: { breadcrumbs: ['Ontology Tree', 'Ontology'] } },
            ]
          },

          {
            path: "propertyTree", component: ParentPropertyTreeComponent, children: [
              { path: "", redirectTo: "propertyTreeView" },
              { path: "propertyTreeView", component: PropertyTreeViewComponent, data: { breadcrumbs: ['Property Tree', 'Ontology'] } },
            ]
          },

          {path: "ViewOntoloyIntents", component: ViewOntologyIntentsComponent, data: { breadcrumbs: ['Knowledge Intents'] }},
          {path: "KnowledgeTasks", component: KnowledgeTaskComponent, data: { breadcrumbs: ['Knowledge Tasks'] }},

          {
            path: "Analytic", component: SharedanaylaticsComponent,
            children: [
              { path: "", redirectTo: "Chatbotconversation" },
              { path: "overview", component: AnaylaticsOverviewComponent, data: { breadcrumbs: [ 'Analytic', 'overview'] } },
              { path: "Chatbotconversation", component: ChatbotConversationComponent, data: { breadcrumbs: [ 'Analytic', 'Chatbotconversation'] } },
              { path: "Agentconversation", component: AgentconversationComponent, data: { breadcrumbs: [ 'Analytic', 'Agentconversation'] } },
              { path: "Gptconversation", component: GptConversationComponent, data: { breadcrumbs: [ 'Analytic', 'Gptconversation'] } },
              { path: "Survey", component: SurveyComponent, data: { breadcrumbs: [ 'Analytic', 'Survey'] } },
              { path: "Leadgeneration", component: LeadgenerationComponent, data: { breadcrumbs: [ 'Analytic', 'Leadgeneration'] } }
            ]
          },

           { path: "aiConversation", component: AiConversationComponent, data: { breadcrumbs: ['AI Agent', 'AI Conversation'] } },
           { path: "AgentTools", component: AgentToolsComponent, data: { breadcrumbs: ['AI Agent', 'AgentTools'] } },
           { path: "Agents", component: AgentsComponent, data: { breadcrumbs: ['AI Agent', 'Agents'] } },
           { path: "KnowledgeBase", component: ParentKnowledgeBaseComponent,
           children:[
            { path: "", redirectTo: "documents" },
             { path: "importData", component: ImportDataComponent, data: { breadcrumbs: [ 'Knowledge Base', 'Import Data'] } },
             { path: "documents", component: DocumentsComponent, data: { breadcrumbs: [ 'Knowledge Base', 'Documents'] } },
             { path: "chat", component: ChatComponent, data: { breadcrumbs: [ 'Knowledge Base', 'chat'] } },
             { path: "indexDetails", component: IndexDetailsComponent, data: { breadcrumbs: [ 'Knowledge Base','Index'] } },
           ]},
          {
            path: "widget-set-up",
            component: WidgetSetupComponent,
            data: { breadcrumbs: ['widget Setup'] }
          },

          { path: "test", component: TestComponent, data: { breadcrumbs: ['Test'] } },
          {
            path: "Options", component: SharedOptionsComponent, children: [
              { path: "", redirectTo: "General", pathMatch: 'full' },
              { path: "General", component: GeneralComponent, data: { breadcrumbs: ['Options', 'General'] } },
              { path: "LLMsettings", component: BrainComponent, data: { breadcrumbs: ['Options', 'LLM Settings'] } },
              { path: "Language", component: LanguagesComponent, data: { breadcrumbs: ['Options', 'Brain'] } },
              { path: "Services", component: ServicesComponent, data: { breadcrumbs: ['Options', 'Services'] } },
              { path: "Login", component: LoginComponent, data: { breadcrumbs: ['Options', 'Login'] } },
              { path: "liveChatEscalation", component: LiveChatEscalationComponent, data: { breadcrumbs: ['Options', 'Live Chat Escalation'] } },
              { path: "ResponseFooter", component: ResponseFooterComponent, data: { breadcrumbs: ['Options', 'Response Footer'] } },
              { path: "mediaBaseURL", component: MediaBaseURLComponent, data: { breadcrumbs: ['Options', 'Media Base URL'] } },
              { path: "StaticResponse", component: StaticResponseComponent, data: { breadcrumbs: ['Options', 'Static Response'] } },
              { path: "FactCategories", component: FactCategoriesComponent, data: { breadcrumbs: ['Options', 'Fact Categories'] } },
            ]
          },
        ]
      },

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectsRoutingModule { }
