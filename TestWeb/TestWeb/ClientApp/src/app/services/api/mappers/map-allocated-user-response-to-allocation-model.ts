import { AllocatedUserModel } from 'src/app/common/models/allocated.user.model';
import { AllocationDetailsResponse } from '../../clients/api-client';

export class MapAllocatedResponseToAllocatedModel {
    public static map(responses: AllocationDetailsResponse[]): AllocatedUserModel[] {
        const allocations = [];
        responses.forEach(response => {
            const allocation = new AllocatedUserModel();
            allocation.allocated_by = response.allocated_by;
            allocation.expires_at = response.expires_at;
            allocation.id = response.id;
            allocation.username = response.username;
            allocations.push(allocation);
        });
        return allocations;
    }
}
