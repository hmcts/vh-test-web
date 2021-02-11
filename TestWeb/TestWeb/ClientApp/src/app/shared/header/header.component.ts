import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from 'src/app/common/models/data/role';
import { ProfileService } from 'src/app/services/api/profile-service';
import { TopMenuItems } from './top-menu-items';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    @Input() loggedIn: boolean;
    topMenuItems = [];
    authorised: boolean;

    constructor(private router: Router, private profileService: ProfileService) {}

    async ngOnInit() {
        await this.onlyShowMenuLinksIfAuthenticated();
    }

    navigateToSelectedMenuItem(indexOfItem: number) {
        for (const item of this.topMenuItems) {
            item.active = false;
        }
        this.topMenuItems[indexOfItem].active = true;
        this.router.navigate([this.topMenuItems[indexOfItem].url]);
    }

    async onlyShowMenuLinksIfAuthenticated() {
        console.log(`Checking Profile for header...`);
        try {
            const profile = await this.profileService.getUserProfile();
            if (profile.role === Role.VHQA) {
                this.topMenuItems = TopMenuItems;
            }
        } catch (error) {
            this.topMenuItems = [];
        }
    }
}
