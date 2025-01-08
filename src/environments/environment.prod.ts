//const serverUrl = 'http://localhost:32446/';
const serverUrl = "/";
const serverUrlTicket = "https://ticket.alkhwarizmi.xyz/";
const whatsappServerUrl = "https://alkhwarizmi.xyz:5050/";
const webHookUrl = "/";
const BaseUrl = "/";
const messenger = "https://orchestrator.alkhwarizmi.xyz/";
// const ResourceHandler = "http://localhost:52848/ResourceHandler";
const ResourceHandler = "https://resources.alkhwarizmi.xyz/ResourceHandler";
export const environment = {
  production: true,

  URLS: {
    BASE_URL: `${serverUrl}`,
    BASE_API_URL: `${serverUrl}Api/`,
    WEBHOOK_URL: `${webHookUrl}WhatsAppRPA/index/`,
    BaseUrl: `${BaseUrl}`,

    IMG_PATH: `/assets/profile/`,

    //#region build
    ////////////////Bulid///////////////////
    GetServicesSet: `${BaseUrl}Services/index/`,
    EditServicesSet: `${BaseUrl}Services/Edit/`,
    CreateServicesSet: `${BaseUrl}Services/Create/`,
    DeleteServicesSet: `${BaseUrl}Services/Delete/`,
    GetContextVariable: `${BaseUrl}ContextVariable/`,
    CreateContextVariable: `${BaseUrl}ContextVariable/Create`,
    EditContextVariable: `${BaseUrl}ContextVariable/Edit`,
    EditContextVariableName: `${BaseUrl}ContextVariable/EditContextVariableName`,
    DeleteContextVariable: `${BaseUrl}ContextVariable/Delete`,
    DeleteServicesContext: `${BaseUrl}ContextVariable/DeleteServices`,
    GetEntities: `${BaseUrl}Entities/getEntities/`,
    GetMenus: `${BaseUrl}Menus/GetMenus`,
    DeleteMenus: `${BaseUrl}Menus/DeleteMenu`,
    CreateMenu: `${BaseUrl}Menus/Create`,
    GetTasks: `${BaseUrl}Intents/GetTasks`,
    UpdateMenu: `${BaseUrl}Menus/Update`,
    GetTypeClasses: `${BaseUrl}Classes/GetClasses`,
    DeleteClasses: `${BaseUrl}Classes/DeleteClass`,
    CreateClass: `${BaseUrl}Classes/Create`,
    EditClass: `${BaseUrl}Classes/Edit`,
    GetSystemEntitiesDataTyps: `${BaseUrl}SystemEntities/getDataTypes/`,
    GetSystemEntities: `${BaseUrl}SystemEntities/`,
    DeleteEntities: `${BaseUrl}SystemEntities/Delete/`,
    CreateEntities: `${BaseUrl}SystemEntities/Create`,
    SaveEntities: `${BaseUrl}SystemEntities/Edit/`,
    GetPreDefinedEntity: `${BaseUrl}SystemEntities/preDefinedEntity/`,
    CreateSystemEntity: `${BaseUrl}SystemEntities/Create/`,
    EditSystemEntity: `${BaseUrl}SystemEntities/Edit/`,
    DeleteSystemEntity: `${BaseUrl}SystemEntities/Delete/`,
    GetClasses: `${BaseUrl}Classes/index/`,
    GetTriggeredTasks: `${BaseUrl}Intents/GetAllTriggers`,
    GetFrame: `${BaseUrl}VerbFrames/GetFrame`,
    GetProperties: `${BaseUrl}Properties/index`,
    GetModifiers: `${BaseUrl}NounModifiers/getModifiers`,
    GetAdverbEntities: `${BaseUrl}Entities/getEntities`,
    getClassandProp: `${BaseUrl}Entities/getClassandProp`,
    GetClasessOnly: `${BaseUrl}Entities/getEntities`,

    /////////tasks/////////
    WorkSpaceTypes: `${BaseUrl}Intents/Type`,
    GetIndexLimit: `${BaseUrl}Intents/IndexLimit`,
    ExportTask: `${BaseUrl}TasksBank/ExportTask`,
    ReturnAfterDigression: `${BaseUrl}Intents/returnAfterDigression`,
    DeleteIntent: `${BaseUrl}Intents/Delete`,
    DeleteType: `${BaseUrl}Intents/DeleteIntentsByType`,
    SetPreBuiltBot: `${BaseUrl}Intents/SetPreBuiltBot`,
    GetPreBuiltBots: `${BaseUrl}Intents/GetPreBuiltBots`,
    MatchPattern: `${BaseUrl}NLUService/MatchPattern`,
    GetExportedTasks: `${BaseUrl}TasksBank/GetAllExportedTasks`,
    ImportTask: `${BaseUrl}TasksBank/ImportTask`,
    CreateTask: `${BaseUrl}Intents/Create`,

    GetTasksTree: `${BaseUrl}Intents/GetTasksTree`,
    GetTaskSetting: `${BaseUrl}Intents/getTaskSetting`,
    GetFlowDiagram: `${BaseUrl}Entities/getFlowDiagram`,
    GetOptions: `${BaseUrl}Projects/getOptions`,
    CreateExample: `${BaseUrl}Examples/Create`,
    EditExample: `${BaseUrl}Examples/Edit`,
    DeleteExample: `${BaseUrl}Examples/Delete`,
    GetAllExamples: `${BaseUrl}Examples`,
    GetIntent: `${BaseUrl}Intents/getIntent`,
    UpdateIntentInfo: `${BaseUrl}Intents/updateIntentInfo`,
    CreateMainTask: `${BaseUrl}Intents/CreateMainTask`,
    DeleteMainTask: `${BaseUrl}Intents/DeleteMainTask`,
    GetAllDialogs: `${BaseUrl}Dialogs`,
    GetAllTasks: `${BaseUrl}Intents/GetTasks`,
    EditDialog: `${BaseUrl}Dialogs/Edit`,
    CreateDialog: `${BaseUrl}Dialogs/Create`,
    //#endregion


    ///////////////// Ontology Entities /////////
    GetCategory: `${BaseUrl}Entities/getCategory`,
    GetFactCategories: `${BaseUrl}Projects/getFactCategories`,
    GetOntologyEntities: `${BaseUrl}Entities/getEntities`,
    DeleteOntologyEntities: `${BaseUrl}Entities/Delete`,
    getGeneratedFrames: `${BaseUrl}Entities/getGeneratedFrames`,
    setIsType: `${BaseUrl}Entities/setIsType`,
    setNegative: `${BaseUrl}Entities/setNegative`,
    setInformative: `${BaseUrl}Entities/setInformative`,
    SetIgnoreTellAbout: `${BaseUrl}Entities/SetIgnoreTellAbout`,
    setAmbClass: `${BaseUrl}Entities/setAmbClass`,
    setTriggerEntity: `${BaseUrl}Entities/setTriggerEntity`,
    setTalkAboutMenu: `${BaseUrl}Entities/setTalkAboutMenu`,
    setFemale: `${BaseUrl}Entities/setFemale`,
    EditIsReviewed: `${BaseUrl}Entities/Edit`,
    SetCategory: `${BaseUrl}Entities/setCategory`,
    TestEnitiesStemes: `${BaseUrl}Entities/testEnitiesStemes`,
    SenseEXFrame: `${BaseUrl}SenseEXFrame/Index`,
    SenseEXFrameGetAny: `${BaseUrl}SenseEXFrame/getAny`,
    getSenseFrame: `${BaseUrl}Sense/getSenseFrame`,
    SetArgumentMapping: `${BaseUrl}Entities/setArgumentMapping`,
    UseEntitie: `${BaseUrl}Entities/UseEntitie`,
    ReplaceEntity: `${BaseUrl}Entities/replaceEntity`,
    AnalyzeText: `${BaseUrl}NLUService/AnalyzeText`,
    GetSense: `${BaseUrl}Sense/getSense`,
    getPOSList: `${BaseUrl}Lexicon/getPOSList`,
    CreatOntoloyEntity: `${BaseUrl}Entities/Create`,
    GetOntologyClassandProp: `${BaseUrl}Entities/getClassandProp`,
    GetPrepList: `${BaseUrl}Lexicon/GetPrepList`,
    PropertiesIndex: `${BaseUrl}Properties/index`,
    SaveFrame: `${BaseUrl}Entities/SaveFrame`,
    GetStemSense: `${BaseUrl}Lexicon/getStemSense`,
    CreateVerbFrame: `${BaseUrl}VerbFrames/create`,
    DeleteVerbFrame: `${BaseUrl}VerbFrames/delete`,
    ReplaceSense: `${BaseUrl}VerbFrames/ReplaceSense`,
    GetEnStem: `${BaseUrl}Sense/getEnStem`,
    DeleteFrame: `${BaseUrl}Entities/DeleteFrame`,


    ///////////////// End Ontology Entities /////////

     //#region Ontolgy Tree
    GetOntologyTree: `${BaseUrl}OntologyTree/index`,
    DeleteNode: `${BaseUrl}OntologyTree/delete`,
    GetVerbFram: `${BaseUrl}VerbFrames/index`,
    CreateChildAndSibbling: `${BaseUrl}OntologyTree/Create`,
    CreateFromGD: `${BaseUrl}DataProperty/CreateFromGD`,
    UpdateOntlolgyTree: `${BaseUrl}OntologyTree/update`,
    UpdatePropertyTree: `${BaseUrl}DataProperty/update`,
    getDataPropertyIndex: `${BaseUrl}DataProperty/index`,
    getClassInfo: `${BaseUrl}Entities/getClassInfo`,
    getSynonyms: `${BaseUrl}Entities/getSynonyms`,
    updateExtention: `${BaseUrl}OntologyTree/updateExtention`,
    UpdateArtificialParent: `${BaseUrl}OntologyTree/UpdateArtificialParent`,
    DeleteSyn: `${BaseUrl}Entities/Delete`,
    AddDomainProperty: `${BaseUrl}DataProperty/addDomain`,
    DeleteDomainProperty: `${BaseUrl}DataProperty/deleteDomain`,
    pushIndividual: `${BaseUrl}Entities/pushIndividual`,
    pullIndividual: `${BaseUrl}Entities/pullIndividual`,
    GetVerbInfo: `${BaseUrl}VerbFrames/GetVerbInfo`,
    getFrameSynonyms: `${BaseUrl}Entities/getSynonyms`,
    SetImplied: `${BaseUrl}Entities/setImplied`,
    GenerateOntologyIntent: `${BaseUrl}OntologyTree/generateOntologyIntent`,
    CreateGraphDb: `${BaseUrl}VerbFrames/CreateGraphDb`,
    updatePropertiesfromGD: `${BaseUrl}DataProperty/updatePropertiesfromGD`,
    CleanDomains: `${BaseUrl}DataProperty/CleanDomains`,
    updateSynonyms: `${BaseUrl}DataProperty/updateSynonyms`,
    deleteRang: `${BaseUrl}DataProperty/deleteRang`,
    addRang: `${BaseUrl}DataProperty/addRang`,
    GetPropertyTreeEntities: `${BaseUrl}OntologyTree/GetEntities`,
    addDomain: `${BaseUrl}DataProperty/addDomain`,
    deleteDomain: `${BaseUrl}DataProperty/deleteDomain`,
    UpdateDomains: `${BaseUrl}DataProperty/UpdateDomains`,
    deletePropertyNode: `${BaseUrl}DataProperty/delete`,
    replaceProperty: `${BaseUrl}DataProperty/replaceProperty`,
    updateQTools: `${BaseUrl}DataProperty/updateQTools`,
    //#endregion

    //#region FactPropertyTree
    GetFactProperty: `${BaseUrl}Entities/GetFactProperty`,
    PropertiesIdex: `${BaseUrl}Properties/index`,
    SaveLinkedArg: `${BaseUrl}Entities/saveLinkedArg`,
    DeleteFrameFactProperty: `${BaseUrl}Entities/DeleteFrameFactProperty`,
    SetFactProperty: `${BaseUrl}Entities/SetFactProperty`,
    updateFactProperty: `${BaseUrl}Entities/updateFactProperty`,
    updateFactTree: `${BaseUrl}Entities/updateFactTree`,
    DeAttachPropertyToFrame: `${BaseUrl}Entities/DeAttachPropertyToFrame`,
    AttachPropertyToFrame: `${BaseUrl}Entities/AttachPropertyToFrame`,
    SetWithExample: `${BaseUrl}Intents/setWithExample`,
    GetExamples: `${BaseUrl}Examples`,
    CreateExampleFact: `${BaseUrl}Examples/Create`,
    DeleteExampleFact: `${BaseUrl}Examples/Delete`,
    DelinkIntent: `${BaseUrl}Entities/delinkIntent`,
    LinkIntent: `${BaseUrl}Entities/LinkIntent`,
    GetEntitiesInOntologyIntents: `${BaseUrl}Entities/getEntities`,
    CorpusIndexIntents: `${BaseUrl}Corpus/index`,
    FactsAsHTML: `${BaseUrl}Corpus/FactsAsHTML`,
    ErrorHTML: `${BaseUrl}Corpus/ErrorHTML`,
    FactsAsTable: `${BaseUrl}Corpus/FactsAsTable`,

    //#endregion
    //#region lanuageTools
    GetStems: `${BaseUrl}LanguageTools/index`,
    LanguageToolsGetVerbs: `${BaseUrl}LanguageTools/GetVerbs`,
    GetProjectNodesAndRelationsLangTools: `${BaseUrl}VerbFrames/GetProjectNodes`,
    GetknowledgeIntentKnowTasks: `${BaseUrl}Intents/GetknowledgeIntent`,
    GetExtractEntities: `${BaseUrl}Entities/ExtractEntities`,
    SaveExample: `${BaseUrl}Examples/Edit/`,
    DeleteExampleKnowTasks: `${BaseUrl}Examples/Delete/`,
    CreateExampleKnowTasks: `${BaseUrl}Examples/Create/`,
    EditIntent: `${BaseUrl}Intents/Edit/`,
    DeleteTask: `${BaseUrl}Intents/deleteTask`,
    CreateIntent: `${BaseUrl}Intents/Create`,
    ConsistencyCheck: `${BaseUrl}Intents/consistencyCheck`,
    ChangeResponseMode: `${BaseUrl}Intents/ChangeResponseMode`,
    //#endregion
    //////////// Dashboard Url //////////////
    Dashboard: `${serverUrl}api/Dashboard/Dashboard/`,
    AllBotDeveloper: `${serverUrl}api/Users/GetUsers/`,
    CreateUesr: `${serverUrl}api/Users/Create/`,
    GetSystemUsers: `${serverUrl}api/Users/GetSystemUsers`,
    GetProjects: `${serverUrl}api/Process/GetProjects`,
    //GetProjects: `${serverUrl}Projects`,
    addUserToProJect: `${serverUrl}api/Users/AddUserToProject`,
    updateDomainData: `${serverUrl}api/GenerateDomainData/UpdateDomainData`,
    GetAllAccount: `${serverUrl}api/Accounts/GetAccounts`,
    DeleteAccount: `${serverUrl}api/Accounts/DeleteAccount`,
    EditAccount: `${serverUrl}api/Accounts/EditAccount`,
    CreateAccount: `${serverUrl}api/Accounts/CreateAccount`,
    GetAccountDetail: `${serverUrl}api/Accounts/GetAccountDetails`,
    EditUser: `${serverUrl}api/Users/Edit`,
    DeleteUser: `${serverUrl}api/Users/Delete`,
    GetprojectsInGenerateDomainData: `${serverUrl}api/GenerateDomainData/GetProjects`,
    GetDeletedProjects: `${serverUrl}api/Process/GetDeletedProjects`,
    RestorProjects: `${serverUrl}api/Process/RestorProjects`,
    //////////// End Dashboard Url //////////////

    ////////////analyticalUrl //////////////////
    GetUniqeUsersCount: `${BaseUrl}Conversation/GetUniqeUsersCount/`,
    GetOnlineUsersCount: `${BaseUrl}Conversation/GetOnlineUsersCount/`,
    GetUsersCount: `${BaseUrl}Conversation/GetUsersCount/`,
    GetStatistics: `${BaseUrl}Conversation/GetStatistics/`,
    GetIntents: `${BaseUrl}Conversation/GetIntents/`,
    GetUnderstanding: `${BaseUrl}Conversation/GetUnderstanding/`,
    GetChatBotConversationServices: `${BaseUrl}Services/index/`,
    GetChatBotConversationSystemEntities: `${BaseUrl}Conversation/GetEnities/`,
    ChatbotConversationIndex: `${BaseUrl}Conversation/Index/`,
    GetMessangerCount: `${BaseUrl}Conversation/GetMessangerUsers/`,
    GetSurviesCounters: `${BaseUrl}Conversation/GetSurviesCounters/`,
    GetSurviesStatistics: `${BaseUrl}Conversation/GetSurviesStatistics/`,
    CreateStatisticReport: `${BaseUrl}Conversation/CreateStatisticReport/`,
    CreateConversationsReport: `${BaseUrl}Conversation/CreateStatisticReport/`,
    LeadGenerationReport: `${BaseUrl}Reports/index`,
    GetSassProjects: `${BaseUrl}SassProjects/GetProjects`,
    ////////////analytical end/////////////////////


    ////////////Knowledge Graph////////////////

    GetProjectNodes: `${BaseUrl}VerbFrames/GetProjectNodes`,
    GetNodeConnections: `${BaseUrl}VerbFrames/GetNodeConnections`,
    GetAllRelationships: `${BaseUrl}VerbFrames/GetRelationConnectedNodes`,
    GetRelationConnectedNodes: `${BaseUrl}VerbFrames/GetAllRelationships`,
    GetProjectNodesAndRelations: `${BaseUrl}VerbFrames/GetProjectNodesAndRelations`,

    ////////////Knowledge Graph end////////////////


    ////////////options////////////////
    GetProjectLang: `${BaseUrl}Projects/getInfo`,
    GetProjectOptions: `${BaseUrl}Projects/getOptions`,
    GetEntityClassAndProp: `${BaseUrl}Entities/getClassandProp`,
    GetStaticResponse: `${BaseUrl}StaticResponses/getStaticResponses`,
    SaveStaticResponses: `${BaseUrl}StaticResponses/saveStaticResponses`,
    GetClassandProp: `${BaseUrl}Entities/getClassandProp`,
    SaveProjectOptions: `${BaseUrl}Projects/setOptions`,
    GetAllProjects: `${BaseUrl}Projects`,
    DeleteProject: `${BaseUrl}Projects/Delete/`,
    DuplicateProject: `${BaseUrl}Projects/Duplicate/`,
    EditProject: `${BaseUrl}Projects/Edit/`,
    NluReload: `${BaseUrl}NLUService/Reload`,
    NluTrain: `${BaseUrl}Annotations/GenerateNLU`,
    CreateWorkSpace: `${BaseUrl}Projects/Create`,

    ////////////optionsEnd////////////////

    ////////////Integrations////////////////
    GetIntegrationIndex: `${BaseUrl}Integration/index`,
    SaveWhatsapp: `${BaseUrl}Integration/saveWhatsapp`,
    SaveTwitterapp: `${BaseUrl}Integration/saveTwitterapp`,

    ////////////Integrations End////////////////

    /////////////////////// chatbot themes////////
    GetChatBotThemes: `/Api/ChatBotThemes?chatBotId=`,
    GetThemeByThemeId: `/Api/ChatBotThemes/Theme?themeId=`,
    CreateNewChatBotTheme: `/Api/ChatBotThemes`,
    UpdateChatBotTheme: `/Api/ChatBotThemes?themeId=`,
    DeleteChatBotTheme: `/Api/ChatBotThemes?themeId=`,
    GetBaseLibFile: `/Api/ChatBotThemes/file?fileName=`,
    UPloadRHImage: `${ResourceHandler}/UploadKHResource`,
    GETRHImage: `${ResourceHandler}/GetV2`,
    updateImagesPath: `/Api/updateImagesPath`,
    /////////////////////// chatbotThemesEnd////////

    ////////////Surveys////////////////
    GetSurveysType: `${serverUrlTicket}api/Survey/GetSurviesTypes`,
    GetSurveyStatistics: `${serverUrlTicket}api/Survey/GetSurveyStatistics`,

    ////////////Surveys End////////////////

    ////////////test////////////////
    GetPredictTree: `${BaseUrl}NLUService/PredictTree`,
    GetMatchPattern: `${BaseUrl}NLUService/matchPattern`,
    GetِAllEntities: `${BaseUrl}Entities/getAllEntities`,
    GetِAllGeneratedEntities: `${BaseUrl}Entities/GetGeneratedEntities`,

    ////////////test End////////////////

    //users account TestCurrentUser
    GetLoggedUserInfo: `${serverUrl}Account/CurrentUser/`,

    //Analytics URLs

    //////////// template Url //////////////
    UPDATE_PROJECT_USER_CONFIG: `${serverUrl}User/UpdateProjectUserConfig`,
    GET_PROJECTS: `${serverUrl}Project/GetUserProjects?userId=`,
    Ondeleteproject: `${serverUrl}Project/DeleteProject`,
    TimeOuts: `${serverUrl}Api/Projects/`,
    getCurrencyList: `${serverUrl}api/ProductiveFamilies/currencyList`,
    GET_PROJECT_BY_PROJECT_ID: `${serverUrl}Project/GetProject?projectId=`,
    CREATE_PROJECT: `${serverUrl}Project/AddProject`,
    UPDATE_PROJECT_NAME: `${serverUrl}Project/UpdateProjectName`,
    UPDATE_PROJECT_Settings: `${serverUrl}Project/UpdateProjectSettings`,
    ADD_PROJECT_SLALEVEL: `${serverUrl}Project/AddProjectSLALevel`,
    EDIT_PROJECT_SLALEVEL: `${serverUrl}Project/EditProjectSLALevel`,
    DELETE_PROJECT_SLALEVEL: `${serverUrl}Project/DeleteProjectSLALevel`,
    UPDATE_PROJECT_SLA_LEVELS: `${serverUrl}Project/UpdateProjectSLALevels`,
    UPDATE_PROJECT_MIN_UNSERVED_QUEUE: `${serverUrl}Project/UpdateProjectMinUnservedQueue`,
    DELETE_PROJECT: `${serverUrl}Project/DeleteProject`,
    GET_PENDING_USERS: `${serverUrl}User/GetPendingUsers?projectId=`,
    UPDATE_project_userStatus: `${serverUrl}User/UpdateProjectUserStatus`,
    GET_USERS_BY_PROJECT_ID: `${serverUrl}Account/GetUsers?projectId=`,
    DELETE_PROJECT_USER: `${serverUrl}User/DeleteProjectUser`,
    INVITE_USER: `${serverUrl}User/InviteUser`,
    RESEND_INVITATION_PENDINGUSER: `${serverUrl}User/ResendInviteUser`,
    DELETE_PENDING_INVITATION: `${serverUrl}User/DeletePendingInvitation?pendingInvitationId=`,
    CHECK_USER_AVILBLE: `${serverUrl}User/checkLogggedAgent?userId=`,
    GET_USER_BY_PROJECT_USER_ID: `${serverUrl}Account/GetProjectUser`,
    GET_USERS_ACTIVITIES: `${serverUrl}ClientRequests/GetUserActivites`,
    GET_USERS_DATA: `${serverUrl}api/users/get/`,
    UPDATE_PROJECT_OPERATION_HOURS: `${serverUrl}Project/UpdateProjectOperatingHours`,
    RESEND_VERIFY_EMAIL: `${serverUrl}Account/Resendverifyemail`,
    UPLOAD_IMG: `${serverUrl}Account/UploadImg`,
    CHANGE_PASSORD: `${serverUrl}Account/ChangePassword`,
    UPDATE_USER_LASTNAME_FIRSTNAME: `${serverUrl}Account/updateusernames/`,
    ////////////End template Url //////////////

  },
  chat: {
    CHAT_BASE_URL: "/chat/",
  },
};
