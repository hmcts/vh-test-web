import { Injectable } from '@angular/core';
import { UserModel } from 'src/app/common/models/user.model';
import Dictionary from 'src/app/shared/helpers/dictionary';
import { UpdateUserResponse } from '../clients/api-client';
import { Logger } from '../logging/logger-base';
import { TestApiService } from './test-api-service';

@Injectable({
    providedIn: 'root'
})
export class ResetService {
    private readonly loggerPrefix: string = '[ResetService] -';
    private userPasswords = new Dictionary<string>();

    constructor(private logger: Logger, private testApiService: TestApiService) {}

    async resetPassword(username: string): Promise<UpdateUserResponse> {
        return await this.sendResetPasswordRequest(username);
    }

    async resetAllPasswords(allocatedUsers: UserModel[]) {
        for (const user of allocatedUsers) {
            const response = await this.sendResetPasswordRequest(user.username);
            if (response) {
                this.logger.debug(`${this.loggerPrefix} User ${user.username} password reset to ${response.new_password}`);
                this.userPasswords.add(user.username, response.new_password);
            }
        }
        return this.userPasswords;
    }

    private async sendResetPasswordRequest(username: string) {
        this.logger.debug(`${this.loggerPrefix} RESETTING USER WITH USERNAME ${username}`);
        try {
            const resetResponse = await this.testApiService.resetUserPassword(username);
            this.logger.debug(`${this.loggerPrefix} PASSWORD RESET.`);
            return resetResponse;
        } catch (error) {
            this.logger.error(`${this.loggerPrefix} Failed to reset password for ${username}.`, error, { payload: username });
            throw error;
        }
    }
}
