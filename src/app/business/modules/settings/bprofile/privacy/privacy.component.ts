import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { projectConstants } from '../../../../../app.component';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { MatDialog } from '@angular/material/dialog';
import { Messages } from '../../../../../shared/constants/project-messages';
import { ConfirmBoxComponent } from '../../../../../ynw_provider/shared/component/confirm-box/confirm-box.component';
import { NavigationExtras } from '@angular/router';
import { Router } from '@angular/router';
import { GroupStorageService } from '../../../../../shared/services/group-storage.service';
import { WordProcessor } from '../../../../../shared/services/word-processor.service';
@Component({
    selector: 'app-privacy',
    templateUrl: './privacy.component.html'
})
export class PrivacyComponent implements OnInit, OnDestroy {
    privacypermissiontxt = projectConstants.PRIVACY_PERMISSIONS;
    normal_privacy_settings_show = 1;
    frm_privacy_cap = Messages.FRM_LEVEL_PRIVACY_MSG;

    add_it_cap = Messages.BPROFILE_ADD_IT_NOW_CAP;
    email_cap = Messages.SERVICE_EMAIL_CAP;
    bProfile = null;
    edit_cap = Messages.EDIT_BTN;
    delete_btn = Messages.DELETE_BTN;
    phone_cap = Messages.BPROFILE_PHONE_CAP;
    info_cap = Messages.BPROFILE_INFORMATION_CAP;
    privacy_sett_cap = Messages.BPROFILE_PRIVACY_SETTINGS_CAP;
    have_not_add_cap = Messages.BPROFILE_HAVE_NOT_ADD_CAP;
    privacydialogRef;
    phonearr: any = [];
    emailarr: any = [];
    domain;
    breadcrumbs = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            title: 'Jaldee Profile',
            url: '/provider/settings/bprofile'
        },
        {
            title: 'Contact Information'
        }
    ];
    breadcrumb_moreoptions: any = [];
    small_device_display = false;
    screenWidth;
    customernormal_label: any;
    constructor(
        private provider_services: ProviderServices,
        private routerobj: Router,
        private router: Router,
        public shared_functions: SharedFunctions,
        private dialog: MatDialog,
        private groupService: GroupStorageService,
        private wordProcessor: WordProcessor
    ) {
        this.customernormal_label = this.wordProcessor.getTerminologyTerm('customer');
     }
    ngOnInit() {
        const user = this.groupService.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
        this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
        this.setPrivacyDetails();
    }
    ngOnDestroy() {
        if (this.privacydialogRef) {
            this.privacydialogRef.close();
        }
    }
    @HostListener('window:resize', ['$event'])
    onResize() {
      this.screenWidth = window.innerWidth;
      if (this.screenWidth <= 767) {
      } else {
        this.small_device_display = false;
      }
      if (this.screenWidth <= 1040) {
        this.small_device_display = true;
      } else {
        this.small_device_display = false;
      }
    }
    // updating the phone number and email ids
    UpdatePrimaryFields(pdata) {
        this.provider_services.updatePrimaryFields(pdata)
            .subscribe(
                data => {
                    this.bProfile = data;
                    this.setPrivacyDetails();
                },
                () => {
                    // this.api_error = error.error;
                }
            );
    }
    learnmore_clicked(mod, e) {
        e.stopPropagation();
        this.routerobj.navigate(['/provider/' + this.domain + '/jaldeeonline->' + mod]);
    }
    performActions() {
        this.routerobj.navigate(['/provider/' + this.domain + '/jaldeeonline->privacy-settings']);
    }
    getBussinessProfileApi() {
        const _this = this;
        return new Promise(function (resolve, reject) {
            _this.provider_services.getBussinessProfile()
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
    setPrivacyDetails() {
        this.bProfile = [];
        this.getBussinessProfileApi()
            .then(
                data => {
                    this.bProfile = data;
                    if (this.bProfile.phoneNumbers || this.bProfile.emails) {
                        this.normal_privacy_settings_show = 3;
                        if (this.bProfile.phoneNumbers) {
                            this.phonearr = [];
                            for (let i = 0; i < this.bProfile.phoneNumbers.length; i++) {
                                this.phonearr.push(
                                    {
                                        'label': this.bProfile.phoneNumbers[i].label,
                                        'instance': this.bProfile.phoneNumbers[i].instance,
                                        'permission': this.bProfile.phoneNumbers[i].permission,
                                        'resource': 'Phoneno'
                                    }
                                );
                            }
                        }
                        if (this.bProfile.emails) {
                            this.emailarr = [];
                            for (let i = 0; i < this.bProfile.emails.length; i++) {
                                this.emailarr.push(
                                    {
                                        'label': this.bProfile.emails[i].label,
                                        'instance': this.bProfile.emails[i].instance,
                                        'permission': this.bProfile.emails[i].permission,
                                        'resource': 'Email'
                                    }
                                );
                            }
                        }
                    }
                });
    }
    deletePrivacysettings(mod, indx) {
        const temparr = [];
        let post_itemdata: any = [];
        if (mod === 'phone') {
            for (let i = 0; i < this.phonearr.length; i++) {
                if (i !== indx) {
                    temparr.push({
                        'label': this.phonearr[i].label,
                        'resource': 'Phoneno',
                        'instance': this.phonearr[i].instance,
                        'permission': this.phonearr[i].permission
                    });
                }
            }
            post_itemdata = {
                'phoneNumbers': temparr
            };
        } else if (mod === 'email') {
            for (let i = 0; i < this.emailarr.length; i++) {
                if (i !== indx) {
                    temparr.push({
                        'label': this.emailarr[i].label,
                        'resource': 'Email',
                        'instance': this.emailarr[i].instance,
                        'permission': this.emailarr[i].permission
                    });
                }
            }
            post_itemdata = {
                'emails': temparr
            };
        }
        this.UpdatePrimaryFields(post_itemdata);
    }
    show_privacyText(txt) {
        let rettxt = '';
        if (txt === 'customersOnly') {
            if (this.customernormal_label !== '' && this.customernormal_label !== undefined && this.customernormal_label !== null) {
                rettxt = 'My ' + this.wordProcessor.firstToUpper(this.customernormal_label) + 's Only';
            } else {
                rettxt = 'My ' + this.privacypermissiontxt[txt] + 's Only';
            }
        } else if (txt === 'all') {
            rettxt = 'Public';
        } else {
            rettxt = 'Private';
        }
        return rettxt;
    }
    deletePrivacysettingsConfirm(mod, indx) {
        let msg = '';
        if (mod === 'phone') {
            msg = Messages.BPROFILE_PRIVACY_PHONE_DELETE;
            msg = msg.replace('[DATA]', '+91 ' + this.phonearr[indx].instance);
        } else if (mod === 'email') {
            msg = Messages.BPROFILE_PRIVACY_EMAIL_DELETE;
            msg = msg.replace('[DATA]', this.emailarr[indx].instance);
        }
        const dialogRef = this.dialog.open(ConfirmBoxComponent, {
            width: '50%',
            panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
            disableClose: true,
            data: {
                'message': msg,
                'heading': 'Delete Confirmation'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.deletePrivacysettings(mod, indx);
            }
        });
    }
    handlePrivacysettings(typ?, peditindx?) {
        const navigationExtras: NavigationExtras = {
            queryParams: {
                bprofile: this.bProfile,
                editindx: peditindx,
                curtype: typ
            }
        };
        this.router.navigate(['provider', 'settings', 'bprofile', 'privacy', 'add'], navigationExtras);
    }
    backPage() {
        this.routerobj.navigate(['provider', 'settings', 'bprofile']);
        // this._location.back();
    }
    getEmailorPhoneStatus(emailorPhone) {
        if (emailorPhone.permission === 'all') {
            return true;
        } else {
            return false;
        }
    }
    changeEmailorPhonestatus(emailorPhone, event) {
        let permission;
        if (event.checked) {
            permission = 'all';
        } else {
            permission = 'self';
        }
        const email_json = [];

        let post_itemdata = {};
        console.log(emailorPhone);
        if (emailorPhone.resource === 'Email') {
            for (const email of this.emailarr) {
                if (email.instance !== emailorPhone.instance) {
                email_json.push({
                    'label': email.label,
                    'resource': emailorPhone.resource,
                    'instance': email.instance,
                    'permission': email.permission
                });
            }
            }
            post_itemdata = { 'emails': email_json };
            console.log(post_itemdata);
        } else {
            for (const phone of this.phonearr) {
                if (phone.instance !== emailorPhone.instance) {
                email_json.push({
                    'label': phone.label,
                    'resource': emailorPhone.resource,
                    'instance': phone.instance,
                    'permission': phone.permission
                });
            }
            }
            post_itemdata = { 'phoneNumbers': email_json };
            console.log(post_itemdata);
        }
        email_json.push({
            'label': emailorPhone.label,
            'resource': emailorPhone.resource,
            'instance': emailorPhone.instance,
            'permission': permission
        });
        this.UpdatePrimaryFields(post_itemdata);
    }
}

