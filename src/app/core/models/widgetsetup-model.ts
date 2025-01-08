export class WidgetStyle {
  _id?: String;
  chatBotID?: string;
  themeName?: string;
  chatBotIcon?: string;
  chatBotBackGroundImage: string;
  primaryColor: string;
  secondaryColor: string;
  header: HeaderCompStyle;
  body: BodyCompStyle;
  footer: TextboxCompStyle;
}

export class HeaderCompStyle {
  primaryBgColor: string;
  displayLogo: boolean;
  headerLogoUrl: string;
  minimizeLogoUrl: string;
  LogoutLogoUrl: string;
  widgetAlignment: string;
}

export class BodyCompStyle {
  backgroundColor: string;
  scrollBgColor?: string;
  displayLogo: boolean;
  botAvatarUrl: string;
  agentAvatarUrl: string;
  message: messageCompStyle;
  moreTextColor: string;
  yesTextColor: string;
  yesBackgroundColor: string;
  yesBorderColor: string;
  noTextColor: string;
  noBackgroundColor: string;
  noBorderColor: string;
}

export class TextboxCompStyle {
  recordingImageDisplay: boolean;
  recordingImageUrl: string;
  sendingImageUrl: string;
  attachingFileImageUrl: string;
  closeCustomerServiceImageUrl: string;
  textImageUrl: string;
  borderColor: string;
  activeBorderColor: string;
  footerBackground?:string;//
  textAreaBackground?:string;
  textAreaInputcolor?:string;
  textAreaPlaceHodercolor?:string;
  replyBackground?:string;//
}

export class messageCompStyle {
  roundedCorners: RounededCorners;
  displayTime: boolean;
  senderBackgroundColor: string;
  botTextColor: string;
  employeeTextColor: string;
  userTextColor: string;
  receiverBackgroundColor: string;
  CustomerServBackgroundColor: string;
  listDisplay: string;
  listItems: MessageListItems;
  mainListDisplay?: string;
  mainListItems: mainMessageListItems;
}

export class RounededCorners {
  value: number;
  unit: string;
}

export class MessageListItems {
  textColor: string;
  backgroundColor: string;
  hoverBgColor: string;
  hoverTextColor: string;
  borderColor?: string;
  borderBottomColor?: string;
  roundedCorners: RounededCorners;
}

export class mainMessageListItems {
  textColor: string;
  backgroundColor: string;
  hoverBgColor: string;
  hoverTextColor: string;
  borderColor?: string;
  borderBottomColor?: string;
  roundedCorners: RounededCorners;
}

export interface IAppConfig {
  messangerUrl: string;
}
