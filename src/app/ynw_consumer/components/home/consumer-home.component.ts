import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import * as moment from 'moment';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { ConsumerServices } from '../../services/consumer-services.service';
import { ConsumerDataStorageService } from '../../services/consumer-datastorage.service';
import { SharedServices } from '../../../shared/services/shared-services';
import { SharedFunctions } from '../../../shared/functions/shared-functions';

import { ConfirmBoxComponent } from '../../shared/component/confirm-box/confirm-box.component';
import { NotificationListBoxComponent } from '../../shared/component/notification-list-box/notification-list-box.component';
import { SearchFields } from '../../../shared/modules/search/searchfields';
import { CheckInComponent } from '../../../shared/modules/check-in/check-in.component';
import { AddInboxMessagesComponent } from '../../../shared/components/add-inbox-messages/add-inbox-messages.component';
import { CheckinLocationListComponent } from '../checkin-location-list/checkin-location-list.component';

import { projectConstants } from '../../../shared/constants/project-constants';

@Component({
  selector: 'app-consumer-home',
  templateUrl: './consumer-home.component.html',
  styleUrls: ['./consumer-home.component.scss']
})
export class ConsumerHomeComponent implements OnInit {

  waitlists;
  fav_providers: any = [];
  history ;
  fav_providers_id_list = [];
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  timeFormat = projectConstants.PIPE_DISPLAY_TIME_FORMAT;

  loadcomplete = {waitlist: false , fav_provider: false, history: false};

  pagination: any  = {
    startpageval: 1,
    totalCnt : 0,
    perPage : projectConstants.PERPAGING_LIMIT
  };

  s3url = null;
  settingsjson = null;
  settings_exists = false;
  futuredate_allowed = false;

  public searchfields: SearchFields = new SearchFields();

  constructor(private consumer_services: ConsumerServices,
    private shared_services: SharedServices,
    public shared_functions: SharedFunctions,
    private dialog: MatDialog, private router: Router,
  private consumer_datastorage: ConsumerDataStorageService) {}

  ngOnInit() {
    this.gets3curl();
    this.getWaitlist();
   // this.getHistoryCount();
   // this.getFavouriteProvider();

  }
  getWaitlist() {

      this.loadcomplete.waitlist = false;

       const params = {
     //  'sort_id': 'asc',
     // 'waitlistStatus-eq': 'checkedIn,arrived'
      };

      this.consumer_services.getWaitlist(params)
      .subscribe(
      data => {
        this.waitlists = data;
        const today = new Date();
        let i = 0;
        for (const waitlist of this.waitlists) {

            const waitlist_date = new Date(waitlist.date);

            today.setHours(0, 0, 0, 0);
            waitlist_date.setHours(0, 0, 0, 0);

            this.waitlists[i].future = false;

            if (today.valueOf() < waitlist_date.valueOf()) {
              this.waitlists[i].future = true;
            }
            this.waitlists[i].estimated_time = this.getAppxTime(waitlist);
            i++;
        }

        this.loadcomplete.waitlist = true;
      },
      error => {
        this.loadcomplete.waitlist = true;
      }
      );
  }

  getHistroy() {
      this.loadcomplete.history = false;
      const params = this.setPaginationFilter();
      this.consumer_services.getWaitlistHistory(params)
      .subscribe(
      data => {
          this.history = data;
          this.loadcomplete.history = true;
      },
      error => {
        this.loadcomplete.history = true;
      }
      );
  }

  getHistoryCount() {
    const date = moment().format(projectConstants.POST_DATE_FORMAT);
    this.consumer_services.getHistoryWaitlistCount()
    .subscribe(
    data => {
      const count: any = data;
      this.pagination.totalCnt = data;
      if (count > 0) {
          this.getHistroy();
      } else {
        this.loadcomplete.waitlist = true;
      }
    },
    error => {
      this.loadcomplete.waitlist = true;
    }
    );
  }

  getFavouriteProvider() {

    this.loadcomplete.fav_provider = false;

    this.shared_services.getFavProvider()
    .subscribe(
    data => {

      this.loadcomplete.fav_provider = true;

      this.fav_providers = data;
      this.fav_providers_id_list = [];
      let k = 0;
      for (const x of this.fav_providers) {

         this.fav_providers_id_list.push(x.id);
         if (this.s3url) {
          this.getbusinessprofiledetails_json(x.id, 'settings', true, k);
         }
         const locarr = [];
         let i = 0;
         for (const loc of x.locations) {
          locarr.push({'locid': x.id + '-' + loc.id, 'locindx': i});
          i++;
         }
         this.getWaitingTime(locarr, k);
         k++;

      }
      console.log( this.fav_providers);
    },
    error => {
      this.loadcomplete.fav_provider = true;
    }
    );
  }

  private getWaitingTime(provids_locid, index) {
    if (provids_locid.length > 0) {
      const post_provids_locid: any = [];
      for (let i = 0; i < provids_locid.length; i++) {
          // if (provids[i] !== undefined) {
            post_provids_locid.push(provids_locid[i].locid);
         // }
      }
     console.log('wtime', provids_locid);
    this.consumer_services.getEstimatedWaitingTime(post_provids_locid)
      .subscribe (data => {
        // console.log('waitingtime api', data);
        let waitlisttime_arr: any = data;
        const locationjson: any = [];

        if (waitlisttime_arr === '"Account doesn\'t exist"') {
          waitlisttime_arr = [];
        }
        const today = new Date();
        const dd = today.getDate();
        const mm = today.getMonth() + 1; // January is 0!
        const yyyy = today.getFullYear();
        let cday = '';
        if (dd < 10) {
            cday = '0' + dd;
        } else {
          cday = '' + dd;
        }
        let cmon;
        if (mm < 10) {
          cmon = '0' + mm;
        } else {
          cmon = '' + mm;
        }
        const dtoday = yyyy + '-' + cmon + '-' + cday;
        const ctoday = cday + '/' + cmon + '/' + yyyy;
        let locindx;

        for (let i = 0; i < waitlisttime_arr.length; i++) {
          locindx = provids_locid[i].locindx;
          // console.log('locindx', locindx);
          this.fav_providers[index]['locations'][locindx]['waitingtime_res'] = waitlisttime_arr[i];
          this.fav_providers[index]['locations'][locindx]['estimatedtime_det'] = [];

          if (waitlisttime_arr[i].hasOwnProperty('nextAvailableQueue')) {
            this.fav_providers[index]['locations'][locindx]['opennow'] = waitlisttime_arr[i]['nextAvailableQueue']['openNow'];
            this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['queue_available'] = 1;
            if (waitlisttime_arr[i]['nextAvailableQueue']['availableDate'] !== dtoday) {
              this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['caption'] = 'Next Available Time ';
              this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['isFuture'] = 1;
              if (waitlisttime_arr[i]['nextAvailableQueue'].hasOwnProperty('queueWaitingTime')) {
                this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['time'] = this.shared_functions.formatDate(waitlisttime_arr[i]['nextAvailableQueue']['availableDate'], {'rettype': 'monthname'})
                  + ', ' + this.shared_functions.convertMinutesToHourMinute(waitlisttime_arr[i]['nextAvailableQueue']['queueWaitingTime']);
              } else {
                this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['time'] = this.shared_functions.formatDate(waitlisttime_arr[i]['nextAvailableQueue']['availableDate'], {'rettype': 'monthname'})
                + ', ' + waitlisttime_arr[i]['nextAvailableQueue']['serviceTime'];
              }
            } else {
              this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['caption'] = 'Estimated Waiting Time';
              this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['isFuture'] = 2;
              if (waitlisttime_arr[i]['nextAvailableQueue'].hasOwnProperty('queueWaitingTime')) {
                this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['time'] = this.shared_functions.convertMinutesToHourMinute(waitlisttime_arr[i]['nextAvailableQueue']['queueWaitingTime']);
              } else {
                this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['time'] = 'Today, ' + waitlisttime_arr[i]['nextAvailableQueue']['serviceTime'];
              }
            }
          } else {
            this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['queue_available'] = 0;
          }
        }
        // console.log('loc final', this.fav_providers[index]['locations']);
      });
    }
  }

  doCancelWaitlist(waitlist) {
    if (!waitlist.ynwUuid || !waitlist.provider.id) {
      return false;
    }

    this.shared_functions.doCancelWaitlist(waitlist)
    .then (
      data => {
        if (data === 'reloadlist') {
          this.getWaitlist();
        }
      },
      error => {
        this.shared_functions.openSnackBar(error.error, {'panelClass': 'snackbarerror'});
      }
    );
  }


  doDeleteFavProvider(fav) {

    if (!fav.id) {
      return false;
    }

    this.shared_functions.doDeleteFavProvider(fav)
    .then(
      data => {
        if (data === 'reloadlist') {
          this.getFavouriteProvider();
        }
      },
      error => {
        this.shared_functions.openSnackBar(error.error, {'panelClass': 'snackbarerror'});
      });
  }

  addFavProvider(id) {
    if (!id) {
      return false;
    }

    this.shared_services.addProvidertoFavourite(id)
    .subscribe(
    data => {
        this.getFavouriteProvider();
    },
    error => {

    }
    );
  }

  getAppxTime(waitlist) {
      if (!waitlist.future && waitlist.appxWaitingTime === 0) {
        return 'Now';
      } else if (!waitlist.future && waitlist.appxWaitingTime !== 0) {
        return waitlist.appxWaitingTime + ' Minutes';

      }  else {
        const moment_date =  this.AMHourto24(waitlist.date, waitlist.queue.queueStartTime);
        return moment_date.add(waitlist.appxWaitingTime, 'minutes') ;
      }
  }

  AMHourto24(date, time12) {
    const time = time12;
    let hours = Number(time.match(/^(\d+)/)[1]);
    const minutes = Number(time.match(/:(\d+)/)[1]);
    const AMPM = time.match(/\s(.*)$/)[1];
    if (AMPM === 'PM' && hours < 12) { hours = hours + 12; }
    if (AMPM === 'AM' && hours === 12) { hours = hours - 12; }
    const sHours = hours;
    const sMinutes = minutes;
    // alert(sHours + ':' + sMinutes);
    const mom_date = moment(date);
    mom_date.set('hour', sHours);
    mom_date.set('minute', sMinutes);
    return mom_date;
  }

  goWaitlistDetail(waitlist) {
    this.router.navigate(['consumer/waitlist', waitlist.provider.id, waitlist.ynwUuid]);
  }

  openNotification(data) {
    if (!data) {
      return false;
    }

    const dialogRef = this.dialog.open(NotificationListBoxComponent, {
      width: '50%',
      data: {
        'messages' : data
      }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  checkIfFav(id) {
    let fav = false;

    this.fav_providers_id_list.map((e) => {
      if ( e === id) {
        fav =  true;
      }
    });
    return fav;
  }

  addWaitlistMessage(waitlist) {
    const pass_ob = {};
    pass_ob['source'] = 'consumer-waitlist';
    pass_ob['uuid'] = waitlist.ynwUuid;
    pass_ob['user_id'] = waitlist.provider.id;
    this.addNote(pass_ob);

  }

  addCommonMessage(provider) {console.log(provider);
    const pass_ob = {};
    pass_ob['source'] = 'consumer-common';
    pass_ob['user_id'] = provider.id;
    this.addNote(pass_ob);
  }

  addNote(pass_ob) {

    const dialogRef = this.dialog.open(AddInboxMessagesComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'consumerpopupmainclass'],
      autoFocus: true,
      data: pass_ob
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {

      }
    });
  }

  handle_pageclick(pg) {
    this.pagination.startpageval = pg;
    this.getHistroy();
  }

  setPaginationFilter() {
    const api_filter = {};
    api_filter['from'] = (this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.pagination.perPage : 0;
    api_filter['count'] = this.pagination.perPage;

    return api_filter;
  }

  showCheckin(data, origin = 'consumer') {

    const  cdate = new Date();
    const  mn = cdate.getMonth() + 1;
    const  dy = cdate.getDate();
    let mon = '';
    let day = '';
    if (mn < 10) {
      mon = '0' + mn;
    } else {
      mon = '' + mn;
    }
    if (dy < 10) {
      day = '0' + dy;
    } else {
      day = '' + dy;
    }
    const curdate = cdate.getFullYear() + '-' + mon + '-' + day;

    const provider_data = data.provider_data;
    const location_data =  data.location_data;

    const dialogRef = this.dialog.open(CheckInComponent, {
       width: '50%',
       panelClass: ['commonpopupmainclass', 'consumerpopupmainclass'],
      data: {
        type : origin,
        is_provider : false,
        moreparams: { source: 'provdet_checkin',
                      bypassDefaultredirection: 1,
                      provider: provider_data,
                      location: location_data,
                      sel_date: curdate
                    },
        datechangereq: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  providerDetail(provider) {
    this.router.navigate(['searchdetail', provider.uniqueId]);
  }

  goCheckin(data, type) {

    let provider_data = null;
    if (type === 'fav_provider') {
      provider_data = data;
    } else {
      provider_data = data.provider || null;
    }

    if (data.locations.length > 1) {

      const dialogRef = this.dialog.open(CheckinLocationListComponent, {
        width: '50%',
        panelClass: ['commonpopupmainclass', 'consumerpopupmainclass'],
        autoFocus: true,
        data: {'location_list' : data.locations }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result.message === 'reloadlist') {
          this.setCheckinData(provider_data, result.data);
        }
      });

    } else {
      this.setCheckinData(provider_data, data.locations[0]);
    }


  }

  setCheckinData(provider, location) {
    const post_data = {
      'provider_data': null,
      'location_data': null
    };

    post_data.provider_data = {
      'unique_id': provider.uniqueId,
      'account_id': provider.id,
      'name': provider.businessName
    };

    post_data.location_data = {
    'id': location.id,
    'name': location.place
    };

    this.showCheckin(post_data);
  }
  gets3curl() {
    this.shared_functions.getS3Url('provider')
      .then(
        res => {
          this.s3url = res;
          this.getFavouriteProvider();
        },
        error => {
          this.shared_functions.apiErrorAutoHide(this, error);
        }
      );
  }
  // gets the various json files based on the value of "section" parameter
  getbusinessprofiledetails_json(provider_id, section, modDateReq: boolean, index) {
    let  UTCstring = null ;
    if (modDateReq) {
      UTCstring = this.shared_functions.getCurrentUTCdatetimestring();
    }
    this.shared_services.getbusinessprofiledetails_json(provider_id, this.s3url, section, UTCstring)
    .subscribe (res => {
        switch (section) {

          case 'settings': {
            this.fav_providers[index]['settings'] = res;
            break;
          }

        }
    },
    error => {

    }
  );
  }

  showcheckInButton(obj) {
    if (this.settingsjson && this.settingsjson.onlineCheckIns && this.settings_exists) {
      return true;
    }
  }


}

