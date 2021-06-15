export class NewPassword {
  Password: string;
  Email: string;

  constructor(pass: string, email: string) {
    this.Password = pass;
    this.Email = email;
  }
}
