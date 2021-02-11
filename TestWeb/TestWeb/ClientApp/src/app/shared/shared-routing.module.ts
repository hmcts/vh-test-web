import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from './error/error.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { PageUrls } from './page-url.constants';

export const routes: Routes = [
    { path: `${PageUrls.ServiceError}`, component: ErrorComponent },
    { path: `${PageUrls.NotFound}`, component: NotFoundComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SharedRoutingModule {}
