import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './shared/components/home/home.component';
import { LogoutComponent } from './shared/components/logout/logout.component';
import { AuthGuardConsumer, AuthGuardHome, AuthGuardProvider } from './shared/guard/auth.guard';
import { ReturnPaymentComponent } from './shared/components/return-payment/return-payment.component';
import { BusinessPageComponent } from './shared/components/business-page/business-page.component';
import { MaintenanceComponent } from './shared/modules/maintenance/maintenance.component';
import { AdminLoginComponent } from './shared/components/admin/login/login.component';
import { ManageProviderComponent } from './shared/components/manage-provider/manage-provider.component';
import { ConsumerJoinComponent } from './ynw_consumer/components/consumer-join/join.component';
import { CheckYourStatusComponent } from './shared/components/status-check/check-status.component';
import { PaymentLinkComponent } from './shared/components/payment-link/payment-link.component';
import { JaldeeBlogComponent } from './shared/components/jaldee-blog/jaldee-blog.component';
import { TelehealthComponent } from './shared/components/telehealth/telehealth.component';
const routes: Routes = [
    { path: 'admin/login/:accountId/:userId', component: AdminLoginComponent },
    {
        path: 'provider', loadChildren: () => import('./business/business.module').then(m => m.BusinessModule),
        canActivate: [AuthGuardProvider]
    },
    {
        path: 'consumer', loadChildren: () => import('./ynw_consumer/consumer.module').then(m => m.ConsumerModule),
        canActivate: [AuthGuardConsumer]
    },
    {
        path: 'kiosk', loadChildren: () => import('./ynw_kiosk/kiosk.module').then(m => m.KioskModule),
        canActivate: [AuthGuardProvider]
    },
    { path: '', component: HomeComponent, canActivate: [AuthGuardHome] },
    { path: 'business', loadChildren: () => import('./shared/components/phome/phome.module').then(m => m.PhomeModule) },
    { path: 'home', redirectTo: '', pathMatch: 'full', canActivate: [AuthGuardHome] },
    { path: 'logout', component: LogoutComponent },
    { path: 'not-found', loadChildren: () => import('./shared/modules/not-found/not-found.module').then(m => m.NotFoundModule) },
    { path: 'searchdetail', loadChildren: () => import('./shared/components/search-detail/search-detail.module').then(m => m.SearchDetailModule) },
    { path: 'payment-return/:id', component: ReturnPaymentComponent },
    { path: 'terms', loadChildren: () => import('./shared/modules/terms-static/terms-static.module').then(m => m.TermsStaticModule) },
    { path: 'business/terms', loadChildren: () => import('./shared/modules/terms-static/terms-static.module').then(m => m.TermsStaticModule) },
    {
        path: 'displayboard/:id', loadChildren: () => import('./business/modules/displayboard-content/displayboard-content.module').then(m => m.DisplayboardLayoutContentModule),
        canActivate: [AuthGuardProvider]
    },
    { path: 'home/:id', loadChildren: () => import('./shared/modules/about-jaldee/about-jaldee.module').then(m => m.AboutJaldeeModule) },
    { path: 'maintenance', component: MaintenanceComponent },
    { path: 'blog', component: JaldeeBlogComponent },
    { path: 'telehealth', component: TelehealthComponent },
    { path: ':id', component: BusinessPageComponent },
    { path: 'manage/:id', component: ManageProviderComponent },
    { path: 'status/:id', component: CheckYourStatusComponent },
    // { path: 'appt/status/:id', component: CheckYourStatusComponent },
      { path: 'consumer-join', component: ConsumerJoinComponent},
    { path: 'pay/:id', component: PaymentLinkComponent }
    // { path: '**', redirectTo: 'not-found' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

