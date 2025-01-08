export class ProjectOptionsModel {
  _id:                   string;
  name:                  string;
  description:           string;
  facebook:              string;
  domainName:            string;
  twitter:               string;
  language:              string;
  languages:             string[];
  proccessingMode:       boolean;
  faq:                   boolean;
  mainEntityId:          number;
  clientEntityId:        number;
  errorCount:            number;
  unSupportedLang:       boolean;
  utteranceMedia:        boolean;
  factCategories:        FactCategory[];
  serviceBaseUrl:        string;
  mediaBaseUrl:          string;
  socialWelcomeInterval: number;
  clearSessionInterval:  number;
  loginType:             number;
  loginValidateService:  number;
  hasFooter:             boolean;
  responseFooter:        ResponseFooter[];
  foolterlanguageIndex:  number;
  useResource:Boolean
}

export class FactCategory {
  name: string;
  id:   number;
}

export class ResponseFooter {
  footer: string;
  lang:   string;
}
