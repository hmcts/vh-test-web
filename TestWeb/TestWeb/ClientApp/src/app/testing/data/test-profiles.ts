import { Role } from 'src/app/common/models/data/role';
import { UserProfileResponse } from '../../services/clients/api-client';

export const testerTestProfile: UserProfileResponse = new UserProfileResponse({
    role: Role.VHQA,
    username: 'james.green@hearings.net'
});

export const judgeTestProfile: UserProfileResponse = new UserProfileResponse({
    role: Role.Judge,
    username: 'judge.fudge@hearings.net'
});

export const adminTestProfile: UserProfileResponse = new UserProfileResponse({
    role: Role.VideoHearingsOfficer,
    username: 'admin@test.com'
});

export const individualTestProfile: UserProfileResponse = new UserProfileResponse({
    role: Role.Individual,
    username: 'james.green@hearings.net'
});
