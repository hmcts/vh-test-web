import { Injectable } from "@angular/core";
import { UserModel } from "src/app/common/models/user.model";
import Dictionary from "src/app/shared/helpers/dictionary";
import { Logger } from "../logging/logger-base";
import { TestApiService } from "./test-api-service";

@Injectable({
  providedIn: 'root'
})
export class ResetService {

  private readonly loggerPrefix: string = '[ResetService] -';
  private userPasswords = new Dictionary<string>()

  constructor(
    private logger: Logger,
    private testApiService: TestApiService
    ) {
  }

  async resetPasswords(allocatedUsers: UserModel[]){
    this.resetAllPasswords(allocatedUsers);
    return this.userPasswords;
  }

  private async resetAllPasswords(allocatedUsers: UserModel[]) {
    for (const user of allocatedUsers) {
        var response = await this.sendResetPasswordRequest(user.username);
        this.logger.debug(`${this.loggerPrefix} User ${user.username} password reset to ${response.new_password}`);
        this.userPasswords.add(user.username, response.new_password);
    }
  }

  private async sendResetPasswordRequest(username: string) {
    this.logger.debug(`${this.loggerPrefix} RESETTING USER WITH USERNAME ${username}`);
    try {
        var resetResponse = await this.testApiService.resetUserPassword(username);
        this.logger.debug(`${this.loggerPrefix} PASSWORD RESET.`);
        return resetResponse;
    } catch (error) {
        this.logger.error(`${this.loggerPrefix} Failed to reset password for ${username}.`, error, { payload: username });
    }
  }
}
