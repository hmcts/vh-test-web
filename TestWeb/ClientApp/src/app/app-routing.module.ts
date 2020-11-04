import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CreateHearingComponent } from './create-hearing/create-hearing.component';
import { pageUrls } from './shared/page-url.constants';

export const routes: Routes = [
    { path: '', redirectTo: `${pageUrls.CreateHearings}`, pathMatch: 'full' },
    { path: pageUrls.Home, redirectTo: `${pageUrls.CreateHearings}`, pathMatch: 'full' },
    { path: `${pageUrls.CreateHearings}`, component: CreateHearingComponent },
    { path: '**', redirectTo: `${pageUrls.NotFound}`, pathMatch: 'full' }
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forRoot(routes, { enableTracing: !environment.production })]
})
export class AppRoutingModule {}
