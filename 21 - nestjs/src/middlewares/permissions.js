import { UserServices } from "../repositories/Repositories.js";
import { AuthorizationError } from "../utils/CustomErrors.js";
export const onlyAdminAccess = async (req, res, next) => {
  try {
    const permission = await UserServices.getRoleByID(req.session.userId);

    if (permission.role === "ADMIN") {
      next();
    } else {
      throw new AuthorizationError();
    }
  } catch (error) {
    if (error instanceof AuthorizationError) {
      res.status(error.statusCode).send(error.getErrorData());
    } else {
      res.status(500).send(error);
    }
  }
};

export const onlyUsersAccess = async (req, res, next) => {
  try {
    const permission = await UserServices.getRoleByID(req.session.userId);
    if (permission.role === "USER") {
      next();
    } else {
      throw new AuthorizationError();
    }
  } catch (error) {
    if (error instanceof AuthorizationError) {
      res.status(error.statusCode).send(error.getErrorData());
    } else {
      res.status(500).send(error);
    }
  }
}

  export const onlyPremiumUsersAccess = async (req, res, next) => {
    try {
      const permission = await UserServices.getRoleByID(req.session.userId);
      if (permission.role === "PREMIUM") {
        next();
      } else {
        throw new AuthorizationError();
      }
    } catch (error) {
      if (error instanceof AuthorizationError) {
        res.status(error.statusCode).send(error.getErrorData());
      } else {
        res.status(500).send(error);
      }
    }
    
};
