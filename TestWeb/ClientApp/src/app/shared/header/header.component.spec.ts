import { Router } from '@angular/router';
import { Role } from 'src/app/common/models/data/role';
import { ProfileService } from 'src/app/services/api/profile-service';
import { UserProfileResponse } from 'src/app/services/clients/api-client';
import { testerTestProfile } from 'src/app/testing/data/test-profiles';
import { HeaderComponent } from './header.component';
import { TopMenuItems } from './top-menu-items';

describe('HeaderComponent', () => {
    let component: HeaderComponent;
    let routerSpy: jasmine.SpyObj<Router>;
    let profileServiceSpy: jasmine.SpyObj<ProfileService>;

    beforeAll(() => {
      routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);
      profileServiceSpy = jasmine.createSpyObj<ProfileService>('ProfileService', ['getUserProfile']);
    });

    beforeEach(() => {
        component = new HeaderComponent(routerSpy, profileServiceSpy);
      });

    it('header component should have top menu items with authenticated user', async () => {
      const allowedProfile = new UserProfileResponse({ role: Role.VHQA, username: 'abc@123.com' });
      profileServiceSpy.getUserProfile.and.returnValue(Promise.resolve(allowedProfile));
      await component.onlyShowMenuLinksIfAuthenticated();
      expect(component.topMenuItems).toEqual(TopMenuItems);
    });

    it('header component should not have top menu items with unauthenticated user', async () => {
      const deniedProfile = new UserProfileResponse({ role: Role.VideoHearingsOfficer, username: 'abc@123.com' });
      profileServiceSpy.getUserProfile.and.returnValue(Promise.resolve(deniedProfile));
      await component.onlyShowMenuLinksIfAuthenticated();
      expect(component.topMenuItems.length).toEqual(0);
    });

    it('selected top menu item has active property set to true, others item active set to false', async () => {
      const profile = new UserProfileResponse({ role: Role.VHQA, username: 'abc@123.com' });
      profileServiceSpy.getUserProfile.and.returnValue(Promise.resolve(profile));
      await component.onlyShowMenuLinksIfAuthenticated();
      component.navigateToSelectedMenuItem(0);
      expect(component.topMenuItems[0].active).toBeTruthy();
      if (component.topMenuItems.length > 1) {
          for (const item of component.topMenuItems.slice(1)) {
              expect(item.active).toBeFalsy();
          }
      }
    });

    it('user should navigate by selecting top menu item', async () => {
      const profile = new UserProfileResponse({ role: Role.VHQA, username: 'abc@123.com' });
      profileServiceSpy.getUserProfile.and.returnValue(Promise.resolve(profile));
      await component.onlyShowMenuLinksIfAuthenticated();
      component.navigateToSelectedMenuItem(0);
      expect(routerSpy.navigate).toHaveBeenCalledWith([component.topMenuItems[0].url]);
    });
});
