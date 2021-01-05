import { DeleteModel } from 'src/app/common/models/delete-model';
import { MapDelete } from './map-delete';

describe('DeleteUserMapper', () => {
    const mapper = new MapDelete();

    it('should map the DeleteModel to the DeleteTestHearingDataRequest', () => {
        const deleteModel: DeleteModel = {
            case_name: 'test case name',
            limit: 100
        };

        const request = MapDelete.map(deleteModel);
        expect(request.partial_hearing_case_name).toBe(deleteModel.case_name);
        expect(request.limit).toBe(deleteModel.limit);
    });
});
