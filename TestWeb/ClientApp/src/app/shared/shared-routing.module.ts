import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from './error/error.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { pageUrls } from './page-url.constants';

export const routes: Routes = [
    { path: `${pageUrls.ServiceError}`, component: ErrorComponent },
    { path: `${pageUrls.NotFound}`, component: NotFoundComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SharedRoutingModule {}
