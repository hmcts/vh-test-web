import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorComponent } from './error/error.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { SharedRoutingModule } from './shared-routing.module';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, SharedRoutingModule],
    declarations: [
        HeaderComponent,
        FooterComponent,
        ErrorComponent,
        NotFoundComponent
    ],
    providers: [WindowScrolling, ScreenHelper],
    exports: [
        HeaderComponent,
        FooterComponent,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule
    ]
})
export class SharedModule {}
