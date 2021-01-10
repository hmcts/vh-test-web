import { AllocationDetailsResponse } from '../../clients/api-client';
import { MapAllocatedResponseToAllocatedModel } from './map-allocated-user-response-to-allocation-model';

describe('MapAllocatedResponseToAllocatedModel', () => {
    it('should map the AllocationResponse to the AllocatedModel', () => {
        const allocations = [];
        const allocationDetails = new AllocationDetailsResponse();
        allocationDetails.allocated = true;
        allocationDetails.allocated_by = 'test@123.com';
        allocationDetails.expires_at = new Date();
        allocationDetails.id = '123';
        allocationDetails.user_id = '456';
        allocationDetails.username = 'username@123.com';
        allocations.push(allocationDetails);

        const response = MapAllocatedResponseToAllocatedModel.map(allocations);
        expect(response[0].allocated_by).toBe(allocationDetails.allocated_by);
        expect(response[0].expires_at).toBe(allocationDetails.expires_at);
        expect(response[0].id).toBe(allocationDetails.id);
        expect(response[0].username).toBe(allocationDetails.username);
    });
});
