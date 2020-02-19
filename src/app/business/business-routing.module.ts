import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProviderResolver } from '../ynw_provider/services/provider-resolver.service';
import { BusinessHomeComponent } from './home/business-home.component';
import { AuthGuardProviderHome, AuthGuardLogin } from '../shared/guard/auth.guard';
import { BusinessComponent } from './business.component';
import { EditProfileComponent } from '../shared/modules/edit-profile/edit-profile.component';
import { ProviderSystemAlertComponent } from '../ynw_provider/components/provider-system-alerts/provider-system-alerts.component';
import { ProviderSystemAuditLogComponent } from '../ynw_provider/components/provider-system-auditlogs/provider-system-auditlogs.component';
import { AddProviderWaitlistCheckInBillComponent } from './modules/check-ins/add-provider-waitlist-checkin-bill/add-provider-waitlist-checkin-bill.component';
// import { ProviderWaitlistCheckInDetailComponent } from '../ynw_provider/components/provider-waitlist-checkin-detail/provider-waitlist-checkin-detail.component';
import { ChangePasswordComponent } from '../shared/modules/change-password/change-password.component';
import { ChangeMobileComponent } from '../shared/modules/change-mobile/change-mobile.component';
import { ProviderMembersComponent } from '../ynw_provider/components/provider-members/provider-members.component';
import { ProviderbWizardComponent } from '../ynw_provider/components/provider-bwizard/provider-bwizard.component';
import { ManageProviderComponent } from '../shared/components/manage-provider/manage-provider.component';

const routes: Routes = [
  {
    path: '', component: BusinessComponent, resolve: { terminologies: ProviderResolver },
    children: [
      { path: '', component: BusinessHomeComponent, canActivate: [AuthGuardProviderHome] },
      { path: 'faq', loadChildren: () => import('./modules/faq/provider-faq.module').then(m => m.ProviderFaqModule) },
      { path: 'customers', loadChildren: () => import('./modules/customers/customers.module').then(m => m.CustomersModule) },
       { path: 'kiosk', loadChildren: () => import('./ynw_kiosk/kiosk.module').then(m => m.KioskModule) },
      {path: 'bill/:id', component: AddProviderWaitlistCheckInBillComponent},
      { path: 'settings', loadChildren: () => import('../ynw_provider/components/provider-settings/provider-settings.module').then(m => m.ProviderSettingsModule) },
      { path: 'profile', component: EditProfileComponent, canActivate: [AuthGuardLogin] },
      { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuardLogin] },
      { path: 'change-mobile', component: ChangeMobileComponent, canActivate: [AuthGuardLogin] },
      { path: 'members', component: ProviderMembersComponent},
      { path: 'inbox', loadChildren: () => import('./modules/mailbox/mailbox.module').then(m => m.MailboxModule) },
      { path: 'finance', loadChildren: () => import('./modules/learnmore/finance/finance.module').then(m => m.FinanceModule)},
      { path: 'foodJoints', loadChildren: () => import('./modules/learnmore/foodjoints/foodjoints.module').then(m => m.FoodjointsModule)},
      { path: 'healthCare', loadChildren: () => import('./modules/learnmore/healthcare/healthcare.module').then(m => m.HealthcareModule)},
      { path: 'personalCare', loadChildren: () => import('./modules/learnmore/personalcare/personalcare.module').then(m => m.PersonalcareModule)},
      { path: 'professionalConsulting', loadChildren: () => import('./modules/learnmore/professional/professional.module').then(m => m.ProfessionalcareModule)},
      { path: 'religiousPriests', loadChildren: () => import('./modules/learnmore/religious/religious.module').then(m => m.ReligiousModule)},
      { path: 'vastuAstrology', loadChildren: () => import('./modules/learnmore/vastu/vastu.module').then(m => m.VastuModule)},
      { path: 'veterinaryPetcare', loadChildren: () => import('./modules/learnmore/veterinary/veterinary.module').then(m => m.VeterinaryModule)},
      { path: 'license', loadChildren: () => import('../business/modules/license/license.module').then(m => m.LicenseModule) },
      { path: 'auditlog', component: ProviderSystemAuditLogComponent },
      { path: 'alerts', component: ProviderSystemAlertComponent },
      { path: 'check-ins', loadChildren: () => import('../business/modules/check-ins/check-ins.module').then(m => m.CheckinsModule)},
      { path: 'bwizard', component: ProviderbWizardComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class BusinessRoutingModule {

}
