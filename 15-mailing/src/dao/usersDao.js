import usersModel from "../model/users.model.js";
import PasswordManagement from "../utils/passwordManagement.js";
export default class UsersDao {
  static async register(first_name, last_name, email, age, password) {
    password = PasswordManagement.hashPassword(password);
    return usersModel.create({ first_name, last_name, email, age, password });
  }
  static async getUserByEmail(email) {
    return usersModel.findOne({ email }).lean();
  }
  static async getUserByID(_id) {
    return usersModel
      .findOne({ _id }, { first_name: 1, last_name: 1, email: 1, age: 1 })
      .lean();
  }
  static async getRoleByID(_id) {
    return usersModel.findOne({ _id }, { role: 1 }).lean();
  }
  static async restorePasswordWithEmail(email, password) {
    const user = await usersModel.findOne({ email }).lean();
    user.password = PasswordManagement.hashPassword(password);
    return usersModel.findByIdAndUpdate(user._id, user, {
      new: true,
    });
  }
  static async restorePasswordWithID(_id, password) {
    const user = await usersModel.findOne({ _id }).lean();
    user.password = PasswordManagement.hashPassword(password);
    return usersModel.findByIdAndUpdate(user._id, user, {
      new: true,
    });
  }
  static async validateNewPassword(_id, password) {
    const user = await usersModel.findOne({ _id }).lean();

    const result = !PasswordManagement.validatePassword(
      password,
      user.password
    );

    return result;
  }
  static async getusersIdByEmail(email) {
    return usersModel.findOne({ email }, { _id: 1 }).lean();
  }
}
