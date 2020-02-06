import { observable, action, decorate } from "mobx";
class PasswordsStore {
  passwords = [];
setPasswords(passwords) {
    this.passwords = passwords;
  }
}
PasswordsStore = decorate(PasswordsStore, {
  passwords: observable,
  setPasswords: action
});
export { PasswordsStore };