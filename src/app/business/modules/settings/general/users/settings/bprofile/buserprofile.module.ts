import { NgModule } from '@angular/core';
import { BuserProfileRoutingModule } from './buserprofile.routing.module';
import { BuserProfileComponent } from './buserprofile.component';
import { BreadCrumbModule } from '../../../../../../../shared/modules/breadcrumb/breadcrumb.module';
import { LoadingSpinnerModule } from '../../../../../../../shared/modules/loading-spinner/loading-spinner.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../../../../shared/modules/common/shared.module';
import { CapitalizeFirstPipeModule } from '../../../../../../../shared/pipes/capitalize.module';
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { Nl2BrPipeModule } from 'nl2br-pipe';
import { MediaComponent } from './media/media.component';
import { LanguagesComponent } from './languages/languages.component';
import { AdditionalInfoComponent } from './additionalinfo/additionalinfo.component';
import { SpecializationsComponent } from './specializations/specializations.component';
import { DynamicFormModule } from '../../../../../dynamic-form/dynamic-form.module';
import { GalleryModule } from '../../../../../../../shared/modules/gallery/gallery.module';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { UserBprofileSearchPrimaryComponent } from './user-bprofile-search-primary/user-bprofile-search-primary.component';
import { ProviderUserBprofileSearchDynamicComponent } from './additionalinfo/provider-userbprofile-search-dynamic.component/provider-userbprofile-search-dynamic.component';
import { UserSpecializationComponent } from './specializations/userspecialization/userspecialization.component';
import { AddProviderUserBprofileSpokenLanguagesComponent } from './languages/addprovideuserbprofilespokenlanguages/addprovideuserbprofilespokenlanguages.component';
import { ProviderUserBprofileSearchSocialMediaComponent } from './media/providerUserBprofileSearchSocialMedia/providerUserBprofileSearchSocialMedia.component';
import { ProPicPopupModule } from '../../../../bprofile/pro-pic-popup/pro-pic-popup.module';
import { AboutmeComponent } from './aboutme/aboutme.component';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
    imports: [
        BuserProfileRoutingModule,
        BreadCrumbModule,
        LoadingSpinnerModule,
        CommonModule,
        SharedModule,
        CapitalizeFirstPipeModule,
        ModalGalleryModule,
        Nl2BrPipeModule,
        DynamicFormModule,
        GalleryModule,
        NgxQRCodeModule,
        ProPicPopupModule,
        ImageCropperModule
    ],
    declarations: [
        BuserProfileComponent,
        MediaComponent,
        ProviderUserBprofileSearchDynamicComponent,
        LanguagesComponent,
        AdditionalInfoComponent,
        SpecializationsComponent,
        AboutmeComponent,
        UserSpecializationComponent,
        UserBprofileSearchPrimaryComponent,
        ProviderUserBprofileSearchSocialMediaComponent,
        AddProviderUserBprofileSpokenLanguagesComponent
    ],
    entryComponents: [
        ProviderUserBprofileSearchDynamicComponent,
        UserBprofileSearchPrimaryComponent,
        UserSpecializationComponent,
        ProviderUserBprofileSearchSocialMediaComponent,
        AddProviderUserBprofileSpokenLanguagesComponent
    ],
    exports: [
        BuserProfileComponent
    ]
})
export class BuserProfileModule { }
