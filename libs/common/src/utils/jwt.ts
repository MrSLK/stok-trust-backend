import { Injectable } from "@nestjs/common";
import jwt from "jsonwebtoken";

@Injectable()
export class JWT {
  generateToken(payload: any) {
    const token = jwt.sign({ id: payload }, "w", { expiresIn: "5m" });
    return token;
  }

  decryptToken(token: any) {
    let values = "";
    let error = "";
    jwt.verify(token, "w", function (err: any, decoded: any) {
      if (err) {
        error = err;
      } else {
        values = decoded.id || "";
      }
    });
    return { id: values, error };
  }

  verifyAndDecryptToken(token: any) {
    let results: any = "";
    jwt.verify(token, "w", function (err: any, decoded: any) {
      if (err) {
        throw new TypeError(err);
      }
      results = decoded;
    });

    return results;
  }
}
