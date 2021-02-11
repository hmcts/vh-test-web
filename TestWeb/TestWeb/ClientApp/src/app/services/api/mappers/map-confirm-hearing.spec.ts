import { ConfirmHearingModel } from 'src/app/common/models/confirm.hearing.model';
import { UpdateBookingStatus } from '../../clients/api-client';
import { MapConfirmHearing } from './map-confirm-hearing';

describe('MapConfirmHearing', () => {
    const mapper = new MapConfirmHearing();

    it('should map the ConfirmHearingModel to the UpdateBookingStatusRequest', () => {
        const confirmHearingModel: ConfirmHearingModel = {
            cancel_reason: 'settled',
            status: UpdateBookingStatus.Created,
            updated_by: 'user@email.com'
        };

        const request = MapConfirmHearing.map(confirmHearingModel);
        expect(request.cancel_reason).toBe(confirmHearingModel.cancel_reason);
        expect(request.status).toBe(confirmHearingModel.status);
        expect(request.updated_by).toBe(confirmHearingModel.updated_by);
    });
});
