import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './security/auth.guard';
import { pageUrls } from './shared/page-url.constants';
import { environment } from 'src/environments/environment';
import { CreateHearingComponent } from "./create-hearing/create-hearing.component";

export const routes: Routes = [
    { path: '', redirectTo: `${pageUrls.Home}`, pathMatch: 'full' },
    { path: `${pageUrls.CreateHearings}`, component: CreateHearingComponent },
    { path: '**', redirectTo: `${pageUrls.NotFound}`, pathMatch: 'full', canActivate: [AuthGuard] }
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forRoot(routes, { enableTracing: !environment.production })]
})
export class AppRoutingModule {}
