import usersModel from "../model/users.model.js";
import PasswordManagement from "../utils/passwordManagement.js";

/**
 * UsersDao class for managing user-related operations
 */
export default class UsersDao {
  /**
   * Register a new user
   * @param {string} first_name - User's first name
   * @param {string} last_name - User's last name
   * @param {string} email - User's email
   * @param {number} age - User's age
   * @param {string} password - User's password
   * @returns {Promise<Object>} - The created user object
   */
  static async register(first_name, last_name, email, age, password) {
    password = PasswordManagement.hashPassword(password);
    return usersModel.create({ first_name, last_name, email, age, password });
  }

  /**
   * Get a user by email
   * @param {string} email - User's email
   * @returns {Promise<Object>} - The user object
   */
  static async getUserByEmail(email) {
    return usersModel.findOne({ email }).lean();
  }

  /**
   * Get a user by ID
   * @param {string} _id - User's ID
   * @returns {Promise<Object>} - The user object with limited fields
   */
  static async getUserByID(_id) {
    return usersModel
      .findOne({ _id }, { first_name: 1, last_name: 1, email: 1, age: 1 })
      .lean();
  }

  /**
   * Get a user's role by ID
   * @param {string} _id - User's ID
   * @returns {Promise<Object>} - The user object with the role field
   */
  static async getRoleByID(_id) {
    return usersModel.findOne({ _id }, { role: 1 }).lean();
  }

  /**
   * Restore a user's password with email
   * @param {string} email - User's email
   * @param {string} password - New password
   * @returns {Promise<Object>} - The updated user object
   */
  static async restorePasswordWithEmail(email, password) {
    const user = await usersModel.findOne({ email }).lean();
    user.password = PasswordManagement.hashPassword(password);
    return usersModel.findByIdAndUpdate(user._id, user, {
      new: true,
    });
  }

  /**
   * Restore a user's password with ID
   * @param {string} _id - User's ID
   * @param {string} password - New password
   * @returns {Promise<Object>} - The updated user object
   */
  static async restorePasswordWithID(_id, password) {
    const user = await usersModel.findOne({ _id }).lean();
    user.password = PasswordManagement.hashPassword(password);
    return usersModel.findByIdAndUpdate(user._id, user, {
      new: true,
    });
  }

  /**
   * Validate a new password for a user
   * @param {string} _id - User's ID
   * @param {string} password - New password
   * @returns {boolean} - True if the new password is different from the current password
   */
  static async validateNewPassword(_id, password) {
    const user = await usersModel.findOne({ _id }).lean();

    const result = !PasswordManagement.validatePassword(
      password,
      user.password
    );

    return result;
  }

  /**
   * Get a user's ID by email
   * @param {string} email - User's email
   * @returns {Promise<Object>} - The user object with the ID field
   */
  static async getusersIdByEmail(email) {
    return usersModel.findOne({ email }, { _id: 1 }).lean();
  }

  /**
   * Update a user's role
   * @param {string} userId - User's ID
   * @param {string} role - New role
   * @returns {Promise<Object>} - The updated user object
   */
  static async updateUserRole(userId, role) {
    return usersModel.findByIdAndUpdate(userId, { role }, { new: true });
  }
}
