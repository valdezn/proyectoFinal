import { ErrorEnum } from "../error.enum.js";

export const errorMiddleware = (error, req, res, next) => {

    switch (error.code) {
      case ErrorEnum.INVALID_TYPES_ERROR:
        res.send({ status: "error", error: error.name, cause: error.cause });
        break;
        case ErrorEnum.PARAM_ERROR:
          res.send({ status: "error", error: error.name, cause: error.cause });
          break;
        default:
        console.log(error)
        res.send({ status: "error", mensaje: "error no manejado" });
    }
}