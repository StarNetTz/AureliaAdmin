export class UserModel {
  UserId : String;
  UserName : String;
  DisplayName : String;
  Password:String;
  Email:String;
  ConfirmPassword:String;
  Roles:Array<String>;
  isActive: Boolean;
  isAdmin:Boolean;
}
