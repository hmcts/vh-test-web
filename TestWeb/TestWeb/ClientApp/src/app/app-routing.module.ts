import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AllocateUsersComponent } from './allocate-users/allocate-users/allocate-users.component';
import { EventsComponent } from './events/events.component';
import { CreateHearingComponent } from './hearings/create-hearing/create-hearing.component';
import { DeleteHearingComponent } from './hearings/delete-hearing/delete-hearing.component';
import { SummaryComponent } from './hearings/summary/summary.component';
import { HomeComponent } from './home/home.component';
import { PageUrls } from './shared/page-url.constants';

export const routes: Routes = [
    { path: '', redirectTo: `${PageUrls.Home}`, pathMatch: 'full' },
    { path: `${PageUrls.Home}`, component: HomeComponent },
    { path: `${PageUrls.CreateHearings}`, component: CreateHearingComponent },
    { path: `${PageUrls.Summary}`, component: SummaryComponent },
    { path: `${PageUrls.DeleteHearings}`, component: DeleteHearingComponent },
    { path: `${PageUrls.Events}`, component: EventsComponent },
    { path: `${PageUrls.AllocateUsers}`, component: AllocateUsersComponent },
    { path: '**', redirectTo: `${PageUrls.NotFound}`, pathMatch: 'full' }
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forRoot(routes, { enableTracing: !environment.production, relativeLinkResolution: 'legacy' })]
})
export class AppRoutingModule {}
