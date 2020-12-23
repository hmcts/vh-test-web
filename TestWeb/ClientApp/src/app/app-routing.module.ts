import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from 'src/environments/environment';
import { EventsComponent } from './events/events.component';
import { CreateHearingComponent } from './hearings/create-hearing/create-hearing.component';
import { DeleteHearingComponent } from './hearings/delete-hearing/delete-hearing.component';
import { SummaryComponent } from './hearings/summary/summary.component';
import { PageUrls } from './shared/page-url.constants';

export const routes: Routes = [
    { path: '', redirectTo: `${PageUrls.CreateHearings}`, pathMatch: 'full' },
    { path: PageUrls.Home, redirectTo: `${PageUrls.CreateHearings}`, pathMatch: 'full' },
    { path: `${PageUrls.CreateHearings}`, component: CreateHearingComponent },
    { path: `${PageUrls.Summary}`, component: SummaryComponent },
    { path: `${PageUrls.DeleteHearings}`, component: DeleteHearingComponent },
    { path: `${PageUrls.Events}`, component: EventsComponent },
    { path: '**', redirectTo: `${PageUrls.NotFound}`, pathMatch: 'full' }
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forRoot(routes, { enableTracing: !environment.production, relativeLinkResolution: 'legacy' })]
})
export class AppRoutingModule {}
