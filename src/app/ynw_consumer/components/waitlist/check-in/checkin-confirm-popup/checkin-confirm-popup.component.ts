import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
// import { Router } from '@angular/router';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { SharedServices } from '../../../../../shared/services/shared-services';
import { Router } from '@angular/router';
import { DateFormatPipe } from '../../../../../shared/pipes/date-format/date-format.pipe';
import { projectConstants } from '../../../../../app.component';


@Component({
    selector: 'app-checkin-confirm-popup',
    templateUrl: './checkin-confirm-popup.component.html',
    styleUrls: ['./checkin-confirm-popup.component.css']
})
export class CheckinConfirmPopupComponent implements OnInit {

    service_det;
    waitlist_for;
    userPhone;
    post_Data;
    account_id;
    trackUuid;
    isFuturedate;
    eMail;
    sel_queue_personaahead;
    selectedMessage = {
        files: [],
        base64: [],
        caption: []
    };
    settingsjson: any = [];
    consumerNote = '';

    dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT_WITH_DAY;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
        public shared_services: SharedServices,
        public sharedFunctionobj: SharedFunctions,
        public provider_services: ProviderServices,
        public router: Router,
        public dateformat: DateFormatPipe,

        public dialogRef: MatDialogRef<CheckinConfirmPopupComponent>) {

            this.service_det = data.service_details;
            this.waitlist_for = data.waitlist_for;
            this.userPhone = data.userPhone;
            this.post_Data = data.post_Data;
            this.account_id = data.account_id;
            this.sel_queue_personaahead = data.sel_queue_personaahead;
            this.isFuturedate = data.isFuturedate;
            this.eMail = data.eMail;
            console.log(this.eMail)
    }
    ngOnInit() {
    }
   
    
    close() {
        this.dialogRef.close();
    }
    getWaitlistMgr() {
        const _this = this;
        return new Promise(function (resolve, reject) {
            _this.provider_services.getWaitlistMgr()
                .subscribe(
                    data => {
                        _this.settingsjson = data;
                        console.log(this.settingsjson.showTokenId)
                        resolve();
                    },
                    () => {
                        reject();
                    }
                );
        });
    }
    showCheckinButtonCaption() {
        let caption = '';
        // caption = 'Confirm';
        if (this.settingsjson.showTokenId) {
            caption = 'Token';
        } else {
            caption = 'Check-in';
        }

        return caption;
    }
    addCheckInConsumer() {
        // this.api_loading = true;
        this.shared_services.addCheckin(this.account_id, this.post_Data)
            .subscribe(data => {
                const retData = data;
                // let retUUID;
                // let prepayAmount;
                let uuidList = [];
                console.log(this.waitlist_for.length);
                Object.keys(retData).forEach(key => {
                    if (key === '_prepaymentAmount') {
                        // prepayAmount = retData['_prepaymentAmount'];
                    } else {
                        // retUUID = retData[key];
                        this.trackUuid = retData[key];
                        uuidList.push(retData[key]);
                    }
                });
                let multiple;
                    if (uuidList.length > 1) {
                        multiple = true;
                    } else {
                        multiple = false;
                    }
                    this.dialogRef.close();

                    this.router.navigate(['consumer', 'checkin', 'confirm'], { queryParams: { account_id: this.account_id, uuid: uuidList, multiple: multiple } });

                // if (this.selectedMessage.files.length > 0) {
                //     this.consumerNoteAndFileSave(retUUID);
                // }
                // const member = [];
                // for (const memb of this.waitlist_for) {
                //     member.push(memb.firstName + ' ' + memb.lastName);
                // }
                // const navigationExtras: NavigationExtras = {
                //     queryParams: {
                //         account_id: this.account_id,
                //         type_check: 'checkin_prepayment',
                //         members: member,
                //         prepayment: prepayAmount
                //     }
                // };
                // if (this.sel_ser_det.isPrePayment) {
                //     this.router.navigate(['consumer', 'checkin', 'payment', this.trackUuid], navigationExtras);
                // } else {
                //     let multiple;
                //     if (uuidList.length > 1) {
                //         multiple = true;
                //     } else {
                //         multiple = false;
                //     }
                //     this.router.navigate(['consumer', 'checkin', 'confirm'], { queryParams: { account_id: this.account_id, uuid: uuidList, multiple: multiple } });
                // }
            },
                error => {
                    // this.api_error = this.sharedFunctionobj.getProjectErrorMesssages(error);
                    this.sharedFunctionobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    // this.api_loading = false;
                });
    }
    consumerNoteAndFileSave(uuid) {
        const dataToSend: FormData = new FormData();
        if (this.consumerNote === '') {
            this.consumerNote = 'Please find the attachment(s) from Consumer with this message';
        }
        dataToSend.append('message', this.consumerNote);
        const captions = {};
        let i = 0;
        if (this.selectedMessage) {
            for (const pic of this.selectedMessage.files) {
                dataToSend.append('attachments', pic, pic['name']);
                captions[i] = 'caption';
                i++;
            }
        }
        const blobPropdata = new Blob([JSON.stringify(captions)], { type: 'application/json' });
        dataToSend.append('captions', blobPropdata);
        this.shared_services.addConsumerWaitlistNote(this.account_id, uuid,
            dataToSend)
            .subscribe(
                () => {
                },
                error => {
                    this.sharedFunctionobj.apiErrorAutoHide(this, error);
                }
            );
    }
}