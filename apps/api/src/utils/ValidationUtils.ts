import { Logger } from "@astra/logger";

export class ValidationUtils {
  private static logger = Logger.getInstance({ title: "Validation Utils" });

  private static readonly USERNAME_PATTERN = /^[a-zA-Z][a-zA-Z0-9_-]{2,29}$/;
  private static readonly USERNAME_MIN_LENGTH = 3;
  private static readonly USERNAME_MAX_LENGTH = 30;

  private static readonly PASSWORD_MIN_LENGTH = 12;
  private static readonly PASSWORD_PATTERN =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;

  private static readonly COMMON_PATTERNS = [
    /password/i,
    /123456/,
    /qwerty/i,
    /admin/i,
    /welcome/i,
    /letmein/i,
    /monkey/i,
    /dragon/i,
    /baseball/i,
    /football/i,
    /shadow/i,
    /master/i,
    /hello/i,
    /freedom/i,
    /whatever/i,
    /qazwsx/i,
    /trustno1/i,
    /654321/i,
    /jordan23/i,
    /harley/i,
    /hunter/i,
    /ranger/i,
    /buster/i,
    /thomas/i,
    /tigger/i,
    /robert/i,
    /soccer/i,
    /batman/i,
    /test123/i,
    /passw0rd/i,
    /iloveyou/i,
    /2000/i,
    /1234/i,
    /abc123/i,
    /111111/i,
    /123123/i,
    /welcome1/i,
    /login/i,
    /admin123/i,
    /qwerty123/i,
    /1q2w3e4r/i,
    /555555/i,
    /lovely/i,
    /7777777/i,
    /888888/i,
    /princess/i,
    /dragon/i,
    /password1/i,
    /solo/i,
    /master/i,
    /666666/i,
    /ashley/i,
    /michael/i,
    /qwertyuiop/i,
    /123321/i,
    /mustang/i,
    /123456789/i,
    /mynoob/i,
    /123qwe/i,
    /18atcskd2w/i,
    /3rjs1la7qe/i,
    /1q2w3e4r5t/i,
    /1qaz2wsx/i,
    /1qaz2wsx3edc/i,
    /zaq1zaq1/i,
    /zaq1xsw2/i,
    /xsw2zaq1/i,
    /!qaz2wsx/i,
    /1qaz@wsx/i,
    /1qaz#edc/i,
    /1qaz$rfv/i,
    /1qaz%tgb/i,
    /1qaz^yhn/i,
    /1qaz&ujm/i,
    /1qaz*ik/i,
    /1qaz\(olp/i,
    /1qaz\)ikm/i,
    /1qaz_olp/i,
    /1qaz\+ikm/i,
    /1qaz-ikm/i,
    /1qaz=ikm/i,
    /1qaz\{olp/i,
    /1qaz\}ikm/i,
    /1qaz\|olp/i,
    /1qaz\\ikm/i,
    /1qaz:olp/i,
    /1qaz"ikm/i,
    /1qaz<olp/i,
    /1qaz>ikm/i,
    /1qaz\?olp/i,
    /1qaz\/ikm/i,
    /1qaz`olp/i,
    /1qaz~ikm/i,
  ];

  private static readonly EMAIL_PATTERN =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  public static validateUsername(username: string): {
    isValid: boolean;
    message: string;
  } {
    if (!username) {
      return { isValid: false, message: "Username is required" };
    }

    if (
      username.length < this.USERNAME_MIN_LENGTH ||
      username.length > this.USERNAME_MAX_LENGTH
    ) {
      return {
        isValid: false,
        message: `Username must be between ${this.USERNAME_MIN_LENGTH} and ${this.USERNAME_MAX_LENGTH} characters`,
      };
    }

    if (!this.USERNAME_PATTERN.test(username)) {
      return {
        isValid: false,
        message:
          "Username must start with a letter and can only contain letters, numbers, underscores, and hyphens",
      };
    }

    return { isValid: true, message: "" };
  }

  public static validatePassword(password: string): {
    isValid: boolean;
    message: string;
  } {
    if (!password) {
      return { isValid: false, message: "Password is required" };
    }

    if (password.length < this.PASSWORD_MIN_LENGTH) {
      return {
        isValid: false,
        message: `Password must be at least ${this.PASSWORD_MIN_LENGTH} characters long`,
      };
    }

    if (!this.PASSWORD_PATTERN.test(password)) {
      return {
        isValid: false,
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      };
    }

    for (const pattern of this.COMMON_PATTERNS) {
      if (pattern.test(password)) {
        return {
          isValid: false,
          message: "Password contains common patterns that are not allowed",
        };
      }
    }

    return { isValid: true, message: "" };
  }

  public static validateEmail(email: string): {
    isValid: boolean;
    message: string;
  } {
    if (!email) {
      return { isValid: false, message: "Email is required" };
    }

    if (!this.EMAIL_PATTERN.test(email)) {
      return { isValid: false, message: "Invalid email format" };
    }

    return { isValid: true, message: "" };
  }

  public static sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, "")
      .replace(/javascript:/gi, "")
      .replace(/on\w+=/gi, "")
      .trim();
  }
}
