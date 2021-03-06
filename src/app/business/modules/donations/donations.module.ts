import { NgModule } from '@angular/core';
import { DonationsRoutingModule } from './donations.routing.module';
import { DonationsComponent } from './donations.component';
import { DonationDetailsComponent } from './details/donation-details.component';
import { BreadCrumbModule } from '../../../shared/modules/breadcrumb/breadcrumb.module';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/modules/common/material.module';
import { LoadingSpinnerModule } from '../../../shared/modules/loading-spinner/loading-spinner.module';
import { PagerModule } from '../../../shared/modules/pager/pager.module';
import { SharedModule } from '../../../shared/modules/common/shared.module';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';
import { Nl2BrPipeModule } from 'nl2br-pipe';
import { QuestionnaireModule } from '../../../shared/components/questionnaire/questionnaire.module';


@NgModule({
    declarations: [DonationsComponent,
        DonationDetailsComponent],
    imports: [
        DonationsRoutingModule,
        BreadCrumbModule,
        CommonModule,
        MaterialModule,
        LoadingSpinnerModule,
        PagerModule,
        SharedModule,
        CapitalizeFirstPipeModule,
        Nl2BrPipeModule,
        QuestionnaireModule,
        CapitalizeFirstPipeModule
    ],
    exports: [DonationsComponent]
})
export class DonationsModule {

}
