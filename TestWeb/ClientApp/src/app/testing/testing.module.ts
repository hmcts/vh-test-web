import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FooterStubComponent } from './stubs/footer-stub';
import { HeaderStubComponent } from './stubs/header-stub';

@NgModule({
    imports: [CommonModule],
    declarations: [
        FooterStubComponent,
        HeaderStubComponent
    ]
})
export class TestingModule {}
