import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BProfileComponent } from './bprofile.component';
import { SpecializationsComponent } from './specializations/specializations.component';
import { LanguagesComponent } from './languages/languages.component';
import { AdditionalInfoComponent } from './additionalinfo/additionalinfo.component';
import { AboutMeComponent } from './aboutme/aboutme.component';
import { JaldeeOnlineComponent } from './jaldee-online/jaldee-online.component';
import { SocialMediaComponent } from './social-media/social-media.component';

const routes: Routes = [
    { path: '', component: BProfileComponent },
    {
        path: '', children: [
            { path: 'specializations', component: SpecializationsComponent },
            { path: 'languages', component: LanguagesComponent },
            { path: 'additionalinfo', component: AdditionalInfoComponent },
            { path: 'aboutme', component: AboutMeComponent },
            { path: 'jaldeeonline', component: JaldeeOnlineComponent },
            { path: 'social', component: SocialMediaComponent }
        ]
    },
    {
        path: 'privacy', loadChildren: () => import('./privacy/privacy.module').then(m => m.PrivacyModule)
    },
    { path: 'jaldee-integration', loadChildren: () => import('./integration/integration-settings.module').then(m => m.IntegrationSettingsModule) }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class BProfileRoutingModule { }
