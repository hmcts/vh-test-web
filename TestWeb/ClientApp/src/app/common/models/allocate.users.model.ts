export class AllocateUsersModel {
  constructor() {
      this.application = 'VideoWeb';
      //this.expiry_in_minutes = 30;
      this.expiry_in_minutes = 1;
      this.is_prod_user = false;
      this.usertypes = [];
  }

  application: string | undefined;
  expiry_in_minutes: number | undefined;
  is_prod_user: boolean;
  test_type: string | undefined;
  usertypes: string[] | undefined;
}
