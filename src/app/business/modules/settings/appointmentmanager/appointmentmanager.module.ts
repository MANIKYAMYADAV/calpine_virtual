import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadCrumbModule } from '../../../../shared/modules/breadcrumb/breadcrumb.module';
import { MaterialModule } from '../../../../shared/modules/common/material.module';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerModule } from '../../../../shared/modules/loading-spinner/loading-spinner.module';
import { FormMessageDisplayModule } from '../../../../shared/modules/form-message-display/form-message-display.module';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../../shared/modules/common/shared.module';
import { SalesChannelModule } from '../../../../shared/modules/saleschannel/saleschannel.module';
import { AppointmentmanagerComponent } from './appointmentmanager.component';
import { AppointmentmanagerRoutingModule } from './appointmentmanager.routing.module';
import { OwlModule } from 'ngx-owl-carousel';
import { Nl2BrPipeModule } from 'nl2br-pipe';
import { CheckinAddMemberModule } from '../../../../shared/modules/checkin-add-member/checkin-add-member.module';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';
import { QuestionnaireModule } from '../../../../shared/components/questionnaire/questionnaire.module';
@NgModule({
    imports: [
        CommonModule,
        BreadCrumbModule,
        AppointmentmanagerRoutingModule,
        MaterialModule,
        FormsModule,
        LoadingSpinnerModule,
        FormMessageDisplayModule,
        NgbTimepickerModule,
        SharedModule,
        SalesChannelModule,
        Nl2BrPipeModule,
        OwlModule,
        CapitalizeFirstPipeModule,
        CheckinAddMemberModule,
        QuestionnaireModule
    ],
    declarations: [
        AppointmentmanagerComponent
    ],
    exports: [AppointmentmanagerComponent]
})
export class AppointmentmanagerModule { }
