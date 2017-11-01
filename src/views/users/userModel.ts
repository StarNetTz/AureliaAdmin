export class UserModel {
  UserId : String;
  Username : String;
  DisplayName : String;
  Password:String;
  Email:String;
  ConfirmPassword:String;
  Roles:Array<String>;
  isActive: Boolean;
  IsAdmin:Boolean;
}
