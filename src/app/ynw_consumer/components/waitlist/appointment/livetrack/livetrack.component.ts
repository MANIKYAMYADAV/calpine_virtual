import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { SharedServices } from '../../../../../shared/services/shared-services';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ConfirmBoxComponent } from '../../../../../shared/components/confirm-box/confirm-box.component';
import { WordProcessor } from '../../../../../shared/services/word-processor.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';

@Component({
    selector: 'app-consumer-livetrack',
    templateUrl: './livetrack.component.html'
})
export class ConsumerAppointmentLiveTrackComponent implements OnInit {

    uuid: any;
    accountId: any;
    trackTimeChange = false;
    trackMode = false;
    liveTrack = false;
    source: any = [];
    travelMode = 'DRIVING';
    notifyTime = 'ONEHOUR';
    notifyAutomatic = true;
    shareLoc = false;
    lat_lng = {
        latitude: 0,
        longitude: 0
    };
    driving = true;
    walking: boolean;
    bicycling: boolean;
    liveTrackMessage;
    track_loading: boolean;
    api_error: any;
    api_loading: boolean;
    payment_popup: any;
    firstTimeClick = true;
    state;
    enableDisabletrackdialogRef;
    constructor(public router: Router,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialog: MatDialog,
        public route: ActivatedRoute,
        public shared_functions: SharedFunctions,
        private shared_services: SharedServices,
        private snackbarService: SnackbarService,
        private wordProcessor: WordProcessor) {
        this.route.params.subscribe(
            params => {
                this.uuid = params.id;
            });
        this.route.queryParams.subscribe(
            params => {
                this.accountId = params.account_id;
                this.state = params.status;
                if (this.state === 'true') {
                    this.shareLoc = true;
                    this.firstTimeClick = false;
                    // this.updateLiveTrackInfo();
                } else {
                    this.shareLoc = false;
                    this.firstTimeClick = true;
                }
            });
    }

    // breadcrumbs;
    // breadcrumb_moreoptions: any = [];
    activeWt: any;

    ngOnInit() {
        // this.breadcrumbs = [
        //     {
        //         title: 'My Jaldee',
        //         url: '/consumer'
        //     },
        //     {
        //         title: 'Live Tracking'
        //     }
        // ];
        this.getCurrentLocation().then(
            (lat_long: any) => {
            }, (error) => {
                this.api_error = 'You have blocked Jaldee from tracking your location. To use this, change your location settings in browser.';
                this.snackbarService.openSnackBar(this.api_error, { 'panelClass': 'snackbarerror' });
                this.shareLoc = false;
                this.track_loading = false;
            }
        );
        this.shared_services.getAppointmentByConsumerUUID(this.uuid, this.accountId).subscribe(
            (wailist: any) => {
                this.activeWt = wailist;
                if (this.shareLoc) {
                    if (this.activeWt.jaldeeApptDistanceTime && this.activeWt.jaldeeApptDistanceTime.jaldeeDistanceTime && this.activeWt.jaldeeApptDistanceTime.jaldeeDistanceTime.jaldeelTravelTime.travelMode === 'DRIVING') {
                        this.driving = true;
                        this.walking = false;
                        this.bicycling = false;
                        this.travelMode = 'DRIVING';
                    } else if (this.activeWt.jaldeeApptDistanceTime && this.activeWt.jaldeeApptDistanceTime.jaldeeDistanceTime && this.activeWt.jaldeeApptDistanceTime.jaldeeDistanceTime.jaldeelTravelTime.travelMode === 'WALKING') {
                        this.walking = true;
                        this.driving = false;
                        this.bicycling = false;
                        this.travelMode = 'WALKING';
                    }
                    // else {
                    //     this.walking = false;
                    //     this.driving = false;
                    //     this.bicycling = true;
                    // }
                }
            },
            () => {
            }
        );
    }

    getTravelMod(event) {
        this.trackMode = false;
        this.travelMode = event;
        if (event === 'DRIVING') {
            this.driving = true;
            this.walking = false;
            this.bicycling = false;
        } else if (event === 'WALKING') {
            this.walking = true;
            this.driving = false;
            this.bicycling = false;
        }
        // else {
        //     this.walking = false;
        //     this.driving = false;
        //     this.bicycling = true;
        // }
        this.saveLiveTrackTravelModeInfo().then(
            data => {
                this.api_loading = true;
                this.liveTrackMessage = this.shared_functions.getLiveTrackStatusMessage(data, this.activeWt.providerAccount.businessName, this.travelMode);
            },
            error => {
                this.api_error = this.wordProcessor.getProjectErrorMesssages(error);
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                this.api_loading = false;
            });
    }
    getNotifyTime(time) {
        this.notifyTime = time;
    }
    saveLiveTrackTravelModeInfo() {
        const _this = this;
        return new Promise(function (resolve, reject) {
            const passdata = {
                'travelMode': _this.travelMode
            };
            _this.shared_services.updateAppointmentTravelMode(_this.uuid, _this.accountId, passdata)
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
    saveLiveTrackInfo() {
        this.track_loading = true;
        const _this = this;
        return new Promise(function (resolve, reject) {
            const post_Data = {
                'jaldeeGeoLocation': {
                    'latitude': _this.lat_lng.latitude,
                    'longitude': _this.lat_lng.longitude
                },
                'travelMode': _this.travelMode,
                'phoneNumber': _this.activeWt.phoneNumber,
                'jaldeeStartTimeMod': _this.notifyTime,
                'shareLocStatus': _this.shareLoc
            };
            _this.shared_services.addAppointmentLiveTrackDetails(_this.uuid, _this.accountId, post_Data)
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
    saveLiveTrackDetails() {
        this.track_loading = true;
        this.updateLiveTrackInfo().then(
            data => {
                this.trackClose('livetrack');
                this.track_loading = false;
            },
            error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                this.api_loading = false;
            });
    }
    trackClose(status) {
        if (status === 'livetrack') {
            if (this.shareLoc) {
                this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('TRACKINGCANCELENABLED').replace('[provider_name]', this.activeWt.providerAccount.businessName));
            } else {
                this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('TRACKINGCANCELDISABLED').replace('[provider_name]', this.activeWt.providerAccount.businessName));
            }
            this.router.navigate(['/consumer']);
        }
    }
    updateLiveTrackInfo() {
        const _this = this;
        return new Promise(function (resolve, reject) {
            const post_Data = {
                'jaldeeGeoLocation': {
                    'latitude': _this.lat_lng.latitude,
                    'longitude': _this.lat_lng.longitude
                },
                'travelMode': _this.travelMode,
                'phoneNumber': _this.activeWt.phoneNumber,
                'jaldeeStartTimeMod': _this.notifyTime,
                'shareLocStatus': _this.shareLoc
            };
            _this.shared_services.updateAppointmentLiveTrackDetails(_this.uuid, _this.accountId, post_Data)
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
    getCurrentLocation() {
        const _this = this;
        return new Promise(function (resolve, reject) {
            if (navigator) {
                navigator.geolocation.getCurrentPosition(pos => {
                    _this.lat_lng.longitude = +pos.coords.longitude;
                    _this.lat_lng.latitude = +pos.coords.latitude;
                    resolve(_this.lat_lng);
                },
                    error => {
                        reject();
                    });
            }
        });
    }
    locationEnableDisable(event) {
        let stat = '';
        if (event.checked) {
            stat = 'enable';
        } else {
            stat = 'disable';
        }
        this.enableDisabletrackdialogRef = this.dialog.open(ConfirmBoxComponent, {
            width: '50%',
            panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
            disableClose: true,
            data: {
              'message': 'Do you really want to ' + stat + ' livetrack?'
            }
          });
          this.enableDisabletrackdialogRef.afterClosed().subscribe(result => {
            if (result) {
        if (event.checked) {
            this.getCurrentLocation().then(
                (lat_long: any) => {
                    this.lat_lng = lat_long;
                    if (!this.firstTimeClick) {
                        this.updateLiveTrackInfo().then(
                            (liveTInfo) => {
                                this.track_loading = false;
                                this.liveTrackMessage = this.shared_functions.getLiveTrackStatusMessage(liveTInfo, this.activeWt.providerAccount.businessName, this.travelMode);
                            }
                        );
                    } else {
                        this.saveLiveTrackInfo().then(
                            (liveTInfo) => {
                                this.track_loading = false;
                                this.firstTimeClick = false;
                                this.liveTrackMessage = this.shared_functions.getLiveTrackStatusMessage(liveTInfo, this.activeWt.providerAccount.businessName, this.travelMode);
                            }
                        );
                    }
                }, (error) => {
                    this.api_error = 'You have blocked Jaldee from tracking your location. To use this, change your location settings in browser.';
                    this.snackbarService.openSnackBar(this.api_error, { 'panelClass': 'snackbarerror' });
                    this.shareLoc = false;
                    this.track_loading = false;
                }
            );
        } else {
            this.shareLoc = false;
            this.updateLiveTrackInfo();
        }
    } else {
        this.shareLoc = !this.shareLoc;
    }
  });
    }
    onCancel(){
        this.router.navigate(['consumer']);
    }
    notifyEvent(event) {
        if (event.checked) {
            this.notifyTime = 'ONEHOUR';
        } else {
            this.notifyTime = 'AFTERSTART';
        }
    }
}
