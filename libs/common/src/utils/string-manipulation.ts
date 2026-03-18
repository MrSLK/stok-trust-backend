import { Injectable } from "@nestjs/common";
import * as nodeCrypto from "crypto";
import moment from "moment-timezone";

@Injectable()
export class StringManipulation {
  camleToSpace(text: string): string {
    const camel2title = text
      .replace(/([A-Z])/g, match => ` ${match}`)
      .replace(/^./, match => match.toUpperCase())
      .toLowerCase();
    return camel2title.charAt(0).toUpperCase() + camel2title.slice(1);
  }

  trimText(str: string, size: number = 60): string {
    const res = str.length > size ? str.substr(0, size - 1) + "..." : str;
    return res;
  }

  removeTrailingSpace(str: string): string {
    if (str.charAt(str.length - 1) === " ") {
      return str.slice(0, -1); // Remove the last character
    }
    return str;
  }

  formatPhoneNumber(phoneNumberString: string): string {
    const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
    if (cleaned) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");
    }
    return null;
  }

  formatPrice(value: string): string {
    const regex = /\.\d+/;
    value = Number(value).toLocaleString();
    if (!regex.test(value)) {
      value = `${value}.00`;
    }
    return value;
  }

  monetize(val: any): string {
    return val
      ? `${val >= 0 ? "" : "-"}${Math.abs(val).toLocaleString("en-US", { style: "currency", currency: "zar" }).slice(2)}`
      : "R 0.00";
  }

  capitilizeEachWord(text: string): string {
    if (typeof text !== "string") return "";
    text = text.trim();
    const splitStr = text.toLowerCase().split(" ");
    for (let i = 0; i < splitStr.length; i++) {
      // You do not need to check if i is larger than splitStr length, as your for does that for you
      // Assign it back to the array
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(" ");
  }
  private fraction() {
    const digits = 8;
    const numBytes = Math.ceil(digits / 2);
    const bytes = nodeCrypto.randomBytes(numBytes);
    const bytesToHex = bytes.toString("hex").substring(0, digits);

    const numerator = Number.parseInt(bytesToHex, 16);
    return numerator * 2.3283064365386963e-10; // 2^-3;
  }

  private choice() {
    const arrayOrString = "23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz";
    const index = Math.floor(this.fraction() * arrayOrString.length);
    if (typeof arrayOrString === "string") {
      return arrayOrString.substr(index, 1);
    }
    return arrayOrString[index];
  }

  generateCustomID() {
    let result = "";
    for (let i = 0; i < 17; i++) {
      result += this.choice();
    }
    return result;
  }
  replaceWhiteSpaceWithDash(inputString: string) {
    // Remove leading and trailing whitespace
    let modifiedString = inputString.trim();

    // Replace spaces with dashes
    modifiedString = modifiedString.replace(/ /g, "-");

    // Convert uppercase letters to lowercase
    modifiedString = modifiedString.toLowerCase();

    return modifiedString;
  }

  replaceDashWithWhiteSpace(inputString: string) {
    // Split the string into an array of words based on dashes
    const words = inputString.split("-");

    // Capitalize the first letter of each word
    for (let i = 0; i < words.length; i++) {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
    }

    // Join the words back together with spaces
    const transformedString = words.join(" ");

    return transformedString;
  }

  formatAddress(property: any) {
    if (!property) {
      return "";
    }
    const { unit, complex, addressShort } = property;
    const address = `${unit ? `${unit} ` : ""}${complex ? `${complex}, ` : ""}${addressShort}`;

    return address;
  }

  retrieveAddressBreakdown(property: any) {
    if (!property) {
      return {};
    }
    const { unit, complex, addressShort } = property;
    return { unit, complex, addressShort };
  }

  formatDate(date: Date, format: string = "DD-MM-YYYY") {
    return date ? moment(date).tz("Africa/Johannesburg").format(format) : "";
  }

  humanify(str: string) {
    return str ? `${str.split("-").map(this.capitilizeEachWord).join(" ")}` : "";
  }

  btoa(b: string) {
    return Buffer.from(b).toString("base64");
  }

  any(...values: any[]) {
    return values.findIndex(value => !!value) === -1 ? false : true;
  }

  all(...values: any[]) {
    return values.findIndex(value => !value) === -1 ? true : false;
  }

  uessDateFormat(dateSample) {
    let dateFormat = ["DD", "MM", "YYYY"],
      formatSep = "-";
    if (dateSample.includes("/")) {
      // date format uses / instead of -
      formatSep = "/";
    } else if (dateSample.includes("-")) {
      // date format uses - instead of /
      formatSep = "-";
    } else {
      // avoid ambiguity
      return null;
    }

    const dateFragments = dateSample.split(formatSep);
    const yearLoc = dateFragments.findIndex(frag => frag.length === 4);
    if (yearLoc === 0) {
      // format is ["YYYY", "XX", "XX"]
      const confirmedDateLoc = [dateFragments[1], dateFragments[2]].findIndex(frag => Number(frag) > 12);
      if (confirmedDateLoc > -1) {
        // format is ["YYYY", "MM", "DD"] or ["YYYY", "DD", "MM"] depending on confirmedDateLoc
        dateFormat = ["YYYY", confirmedDateLoc ? "MM" : "DD", !confirmedDateLoc ? "MM" : "DD"];
      } else {
        // assume format is ["YYYY", "MM", "DD"]
        dateFormat = ["YYYY", "MM", "DD"];
      }
    } else {
      // format is ["XX", "XX", "YYYY"]
      const confirmedDateLoc = [dateFragments[0], dateFragments[1]].findIndex(frag => Number(frag) > 12);
      if (confirmedDateLoc > -1) {
        // format is ["DD", "MM", "YYYY"] or ["MM", "DD", "YYYY"] depending on confirmedDateLoc
        dateFormat = [confirmedDateLoc ? "MM" : "DD", !confirmedDateLoc ? "MM" : "DD", "YYYY"];
      } else {
        // assume format is ["DD", "MM", "YYYY"]
        dateFormat = ["DD", "MM", "YYYY"];
      }
    }

    return dateFormat.join(formatSep);
  }

  slugify(text: string = "", limit: number = 0): string {
    if (text === null || text === undefined) {
      return "";
    }

    const newText = text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w\-]+/g, "") // Remove all non-word chars
      .replace(/\-\-+/g, "-") // Replace multiple - with single -
      .replace(/^-+/, "") // Trim - from start of text
      .replace(/-+$/, ""); // Trim - from end of text

    if (limit && limit > 0) {
      return newText.substring(0, limit);
    }

    return newText;
  }

  convertToValidDate = (dateString: string) => {
    // Check if dateString is not null or empty
    if (!dateString) return null;

    // Example date string: "25th October 2023"
    // Remove the ordinal suffix (e.g., "th", "st", "nd", "rd") from the day
    const cleanDateString = dateString.replace(/(\d+)(st|nd|rd|th)/, "$1");

    return moment(cleanDateString, "D MMMM YYYY").toDate();
  };
}
