import { NgModule, OnInit } from '@angular/core';
import { LicenseComponent } from './license.component';
import { SharedModule } from '../../../shared/modules/common/shared.module';
import { CommonModule } from '@angular/common';
import { LicenseRoutingModule } from './license.routing.module';
import { LoadingSpinnerModule } from '../../../shared/modules/loading-spinner/loading-spinner.module';
import { BreadCrumbModule } from '../../../shared/modules/breadcrumb/breadcrumb.module';
import { ProviderBprofileSearchAdwordsComponent } from '../../../ynw_provider/components/provider-bprofile-search-adwords/provider-bprofile-search-adwords.component';
import { ProviderPaymentHistoryComponent } from '../../../ynw_provider/components/provider-payment-history/provider-payment-history.component';
import { PagerModule } from '../../../shared/modules/pager/pager.module';
import { AddonsComponent } from './addons/addons.component';
import { AddproviderAddonComponent } from '../../../ynw_provider/components/add-provider-addons/add-provider-addons.component';
import { ProviderAddonAuditlogsComponent } from '../../../ynw_provider/components/provider-addon-auditlogs/provider-addon-auditlogs.component';
import { KeywordsComponent } from './keywords/keywords.component';
import { UpgradeLicenseComponent } from '../../../ynw_provider/components/upgrade-license/upgrade-license.component';
import { ProviderAuditLogComponent } from '../../../ynw_provider/components/provider-auditlogs/provider-auditlogs.component';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';
import { licenseusageComponent } from './licenseusage/licenseusage.component';
import { StatementsComponent } from './statements/statements.component';
import { InvoiceStatusComponent } from './invoicestatus/invoicestatus.component';
import { ViewPrevStatementComponent } from './statements/viewprevstatement.component';
import { PaymentComponent } from './payments/licensepayment.component';
import { AddonDetailComponent } from './addons/addon-detail/addon-detail.component';

@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        LoadingSpinnerModule,
        BreadCrumbModule,
        LicenseRoutingModule,
        PagerModule,
        CapitalizeFirstPipeModule

    ],
    declarations: [
        ProviderBprofileSearchAdwordsComponent,
        LicenseComponent,
        AddonsComponent,
        PaymentComponent,
        ProviderPaymentHistoryComponent,
        AddproviderAddonComponent,
        ProviderAddonAuditlogsComponent,
        KeywordsComponent,
        InvoiceStatusComponent,
        licenseusageComponent,
        UpgradeLicenseComponent,
        ProviderAuditLogComponent,
        StatementsComponent,
        ViewPrevStatementComponent,
        AddonDetailComponent
    ],
    entryComponents: [
        AddproviderAddonComponent,
        ProviderAddonAuditlogsComponent,
        UpgradeLicenseComponent,
        ProviderAuditLogComponent,
        StatementsComponent,
        ViewPrevStatementComponent
    ],
    exports: [LicenseComponent]
})

export class LicenseModule implements OnInit {
    ngOnInit() {

    }
}
