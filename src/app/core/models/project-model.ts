import { UserModel } from "./user-model";
import { ProjectUserModel } from "./project-user-model";

export interface ProjectModel {
  _id: string;
  categoryName?: string;
  updatedAt?: any;
  createdAt?: any;
  name?: string;
  activeOperatingHours?: boolean;
  operatingHours?: any;
  createdBy?: string;
  // id_project?: any;
  widget?: any;

  role?: string;
  user_available?: boolean;
  //  profile_name?: any;
  //  profile_agents?: any;
  //  profile_type?: string;
  subscription_is_active?: any;
  //  profile?: any;
  subscription_end_date?: any;
  subscription_id?: any;
  chatbotId?: string;
  SLALevels?: SLALevel[];
  timeOuts?: TimeOuts;
  minUnservedQueue?: number;
  __v?: any;
  tzname?: string;
  whatsappPhone?: string;
  users?: ProjectUserModel[];
  varaible?: Varaible;
  settings?: ProjectSettings;
}
export class ProjectSettings {
  languages?: string[];
  currency?: CurrencyModel;
  waSettings?: whatsAppSettings;
  maxGeoDistanceTakeaway: number;
  maxGeoDistanceDelivery: number;
  orderAlarm: number;
  orderRejection: number;
}
export class whatsAppSettings {
  sandbox: boolean;
  waMethod: string;
  whatsAppPhone: string;
  accountId: string;
  phoneId: string;
  accessToken: string;
}
export class CurrencyModel {
  country: string;
  code: string;
  symbol: string;
  names: NameLang[];
  concatenatePrice: boolean;
}
export class NameLang {
  text: string;
  language: string;
}
// export class Sitting{
//   name

// }
export class Varaible {
  brandName: string;
  welcomeMessage: string;
  welcomeImage: string;
}
export class SLALevel {
  slaLevelId: number;
  name: string;
  responseTime: number;
  chatDuration: number;
  totalChatsPercentage: number;
  satisfactionPercentage: number;
  ChatSlots: number;
  constructor(
    name: string,
    responseTime: number,
    chatDuration: number,
    totalChatsPercentage: number,
    satisfactionPercentage: number,
    ChatSlots: number
  ) {
    this.name = name;
    this.responseTime = responseTime;
    this.chatDuration = chatDuration;
    this.totalChatsPercentage = totalChatsPercentage;
    this.satisfactionPercentage = satisfactionPercentage;
    this.ChatSlots = ChatSlots;
  }
}

export class TimeOuts {
  agentDisconnected: number;
  clientDisconnected: number;
  clientInactive: number;
  agentInactive: number;
}
