export interface ProjectUserModel {
  // _id: string;
  updatedAt: any;
  createdAt: any;
  id_project: string;
  id_user: string;
  user_available?: boolean;
  role: string;
  createdBy: string;
  is_group_member: boolean;
  __v: any;
  firstname?: string;
  lastname?: string;
  email?: string;
  //  ChatSlots?: number;
  SLALEVELID?: number;
  userStatus?: ConnectionStatus;
  groupsName?: string[];
  img?: string;
  chattingType: string;
  branchId?: string;
  branchName?: string;
}
class ConnectionStatus {
  state: string;
  timeStamp: Date;
}
