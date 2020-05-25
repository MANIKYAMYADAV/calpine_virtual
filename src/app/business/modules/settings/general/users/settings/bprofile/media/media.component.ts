import { Component, OnInit, OnDestroy } from '@angular/core';
import { Messages } from '../../../../../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../../../../../shared/constants/project-constants';
import { Image, PlainGalleryConfig, PlainGalleryStrategy, AdvancedLayout, ButtonEvent, ButtonType } from 'angular-modal-gallery';
import { ProviderServices } from '../../../../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../../../../shared/functions/shared-functions';
import { ProviderDataStorageService } from '../../../../../../../../ynw_provider/services/provider-datastorage.service';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { GalleryService } from '../../../../../../../../shared/modules/gallery/galery-service';
import { Subscription } from 'rxjs';
import { ProviderUserBprofileSearchSocialMediaComponent } from './providerUserBprofileSearchSocialMedia/providerUserBprofileSearchSocialMedia.component';
@Component({
    selector: 'app-usermedia',
    templateUrl: './media.component.html'
})
export class MediaComponent implements OnInit, OnDestroy {
    bProfile = null;
    frm_social_cap = '';
    frm_gallery_cap = '';
    error_msg = '';
    socialdialogRef;
    gallerydialogRef;
    delgaldialogRef;
    social_media_cap = Messages.BPROFILE_SOCIAL_MEDIA_CAP;
    add_social_media = Messages.BPROFILE_ADD_SOCIAL_MEDIA_CAP;
    no_social_media = Messages.NO_SOCIAL_MEDIA;
    gallery_cap = Messages.GALLERY_CAP;
    photos_to_cap = Messages.BPROFILE_PHOTOS_CAP;
    photo_cap = Messages.BPROFILE_PHOT0_CAP;
    have_not_add_cap = Messages.BPROFILE_HAVE_NOT_ADD_CAP;
    add_it_cap = Messages.BPROFILE_ADD_IT_NOW_CAP;
    orgsocial_list: any = [];
    social_arr: any = [];
    social_list: any = [];
    showaddsocialmedia = false;
    normal_gallery_show = 1;
    normal_socialmedia_show = 1;
    customer_label = '';
    error_list = [];
    image_list: any = [];
    image_list_popup: Image[];
    image_showlist: any = [];
    edit_cap = Messages.EDIT_BTN;
    delete_btn = Messages.DELETE_BTN;
    item_pic = {
        files: [],
        base64: null
    };
    profimg_exists = false;
    success_error = null;
    selitem_pic = '';
    image_remaining_cnt = 0;
    breadcrumb_moreoptions: any = [];
    domain;
    customPlainGalleryRowConfig: PlainGalleryConfig = {
        strategy: PlainGalleryStrategy.CUSTOM,
        layout: new AdvancedLayout(-1, true)
    };
    breadcrumbs_init = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            title: Messages.GENERALSETTINGS,
            url: '/provider/settings/general'
        },
        {
            url: '/provider/settings/general/users',
            title: 'Users'

        }
    ];
    breadcrumbs = this.breadcrumbs_init;
    subscription: Subscription;
    userId: any;

    constructor(
        private provider_services: ProviderServices,
        private sharedfunctionobj: SharedFunctions,
        private provider_datastorage: ProviderDataStorageService,
        private activated_route: ActivatedRoute,
        private routerobj: Router,
        private galleryService: GalleryService,
        public shared_functions: SharedFunctions,
        private dialog: MatDialog
    ) {
        this.activated_route.params.subscribe(params => {
            this.userId = params.id;
        }
        );
        this.customer_label = this.sharedfunctionobj.getTerminologyTerm('customer');
    }
    ngOnInit() {
        this.getUser();
        const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
        // this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }]};
        this.frm_social_cap = Messages.FRM_LEVEL_SOCIAL_MSG.replace('[customer]', this.customer_label);
        this.frm_gallery_cap = Messages.FRM_LEVEL_GALLERY_MSG.replace('[customer]', this.customer_label);
        this.orgsocial_list = projectConstants.SOCIAL_MEDIA;
        // this.getGalleryImages();
        this.getBusinessProfile();
    }

    learnmore_clicked(mod, e) {
        e.stopPropagation();
        this.routerobj.navigate(['/provider/' + this.domain + '/profile-search->' + mod]);
    }
    ngOnDestroy() {
        if (this.socialdialogRef) {
            this.socialdialogRef.close();
        }
        if (this.delgaldialogRef) {
            this.delgaldialogRef.close();
        }
    }
    getUser() {
        this.provider_services.getUser(this.userId)
            .subscribe((data: any) => {
                const breadcrumbs = [];
                this.breadcrumbs_init.map((e) => {
                    breadcrumbs.push(e);
                });
                breadcrumbs.push({
                    title: data.firstName,
                    url: '/provider/settings/general/users/add?type=edit&val=' + this.userId,
                });
                breadcrumbs.push({
                    title: 'Settings',
                    url: '/provider/settings/general/users/' + this.userId + '/settings'
                  });
                breadcrumbs.push({
                    title: 'Online Profile',
                    url: '/provider/settings/general/users/' + this.userId + '/settings/bprofile',
                });
                breadcrumbs.push({
                    title: 'Social Media'
                });
                this.breadcrumbs = breadcrumbs;
            });
    }
    getBusinessProfile() {
        this.showaddsocialmedia = false;
        this.bProfile = [];
        this.getBussinessProfileApi()
            .then(
                data => {
                    this.bProfile = data;
                    this.provider_datastorage.set('bProfile', data);
                    this.normal_socialmedia_show = 2;
                    this.social_arr = [];
                    if (this.bProfile.socialMedia) {
                        if (this.bProfile.socialMedia.length > 0) {
                            this.normal_socialmedia_show = 3;
                            for (let i = 0; i < this.bProfile.socialMedia.length; i++) {
                                if (this.bProfile.socialMedia[i].resource !== '') {
                                    this.social_arr.push({ 'Sockey': this.bProfile.socialMedia[i].resource, 'Socurl': this.bProfile.socialMedia[i].value });
                                }
                            }
                        }
                    }
                    if (this.social_arr.length < this.orgsocial_list.length) {
                        this.showaddsocialmedia = true;
                    }

                },

                () => {
                    this.normal_socialmedia_show = 2;
                }
            );
    }


    getBussinessProfileApi() {
        const _this = this;
        return new Promise(function (resolve, reject) {
            _this.provider_services.getUserBussinessProfile(_this.userId)
                .subscribe(
                    data => {
                        resolve(data);
                    },
                    () => {
                        reject();
                    }
                );
        });
    }

    confirmDelete(file, indx) {
        const skey = this.image_list[indx].keyName;
        file.keyName = skey;
        this.sharedfunctionobj.confirmGalleryImageDelete(this, file);
    }

    getSocialdet(key, field) {
        const retdet = this.orgsocial_list.filter(
            soc => soc.key === key);
        const returndet = retdet[0][field];
        return returndet;
    }
    check_alreadyexists(v) {
        for (let i = 0; i < this.social_arr.length; i++) {
            if (this.social_arr[i].Sockey === v) {
                return true;
            }
        }
        return false;
    }
    handleSocialmedia(key) {
        this.socialdialogRef = this.dialog.open(ProviderUserBprofileSearchSocialMediaComponent, {
            width: '50%',
            // panelClass: 'socialmediamainclass',
            panelClass: ['popup-class', 'commonpopupmainclass'],
            disableClose: true,
            autoFocus: true,
            data: {
                bprofile: this.bProfile,
                editkey: key || '',
                userId: this.userId
            }
        });
        this.socialdialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (result === 'reloadlist') {
                    this.getBusinessProfile();
                }
            }
        });
    }
    deleteSocialmedia(sockey) {
        const post_data: any = [];
        for (let i = 0; i < this.social_arr.length; i++) {
            if (this.social_arr[i].Sockey !== sockey) {
                post_data.push({ 'resource': this.social_arr[i].Sockey, 'value': this.social_arr[i].Socurl });
            }
        }
        const submit_data = {
            'socialMedia': post_data
        };
        this.provider_services.updateUserSocialMediaLinks(submit_data, this.userId)
            .subscribe(
                () => {
                    this.getBusinessProfile();
                },
                () => {

                }
            );

    }
    editSocialmedia(key) {
        this.handleSocialmedia(key);
    }
}