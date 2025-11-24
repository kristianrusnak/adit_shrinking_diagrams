type ProcessPumlResponse = {
  parsed: any;
  reduced: any;
  result_puml: string;
};

type UserInfo = {
  id: number;
  email: string;
  accessToken: string;
  refreshToken: string;
};
