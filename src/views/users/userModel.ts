export class UserModel {
  UserId : String;
  Username : String;
  DisplayName : String;
  Password:String;
  Email:String;
  ConfirmPassword:String;
  Roles:Array<Role>;
  isActive: Boolean;
  IsAdmin:Boolean;
}

export class Role{
  Id: String;
  Name: String;
  IsMemberOf: Boolean;
}