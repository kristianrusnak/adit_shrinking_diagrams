type ProcessPumlResponse = {
  parsed: any;
  reduced: any;
  result_puml: string;
};

type UserInfo = {
  id: number;
  email: string;
  access_token: string;
  refresh_token: string;
};
