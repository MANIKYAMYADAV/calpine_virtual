import { Component, OnInit, HostListener } from '@angular/core';
import { projectConstants } from '../../../app.component';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { Router } from '@angular/router';
import { DateFormatPipe } from '../../../shared/pipes/date-format/date-format.pipe';
import { Messages } from '../../../shared/constants/project-messages';
import { ProviderWaitlistCheckInConsumerNoteComponent } from '../check-ins/provider-waitlist-checkin-consumer-note/provider-waitlist-checkin-consumer-note.component';
import { MatDialog } from '@angular/material/dialog';
import { ProviderSharedFuctions } from '../../../ynw_provider/shared/functions/provider-shared-functions';
import { projectConstantsLocal } from '../../../shared/constants/project-constants';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../shared/services/word-processor.service';
import { GroupStorageService } from '../../../shared/services/group-storage.service';
import { DateTimeProcessor } from '../../../shared/services/datetime-processor.service';

@Component({
  'selector': 'app-donations',
  'templateUrl': './donations.component.html'
})
export class DonationsComponent implements OnInit {
  filter_sidebar = false;
  filterapplied = false;
  open_filter = false;
  check_status;
  filter = {
    first_name: '',
    last_name: '',
    date: null,
    service: '',
    page_count: projectConstants.PERPAGING_LIMIT,
    page: 1
  }; // same in resetFilter Fn
  domain;
  breadcrumb_moreoptions: any = [];
  breadcrumbs_init = [
    {
      title: 'Donations'
    }
  ];
  breadcrumbs = this.breadcrumbs_init;
  pagination: any = {
    startpageval: 1,
    totalCnt: 0,
    perPage: this.filter.page_count
  };
  isCheckin;
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  // newDateFormat = projectConstantsLocal.PIPE_DISPLAY_DATE_FORMAT_WITH_DAY;
  newDateFormat = projectConstantsLocal.DATE_EE_MM_DD_YY_FORMAT;
  loadComplete = false;
  minday = new Date(2015, 0, 1);
  maxday = new Date();
  
  tooltipcls = projectConstants.TOOLTIP_CLS;
  date_cap = Messages.DATE_CAP;
  amount_cap = Messages.AMOUNT_CAP;
  apiloading = false;
  filters: any = {
    'first_name': false,
    'last_name': false,
    'date': false,
    // 'mobile': false,
    // 'email': false
    'service': false
  };
  selected = 0;
  donationsSelected: any = [];
  donations: any = [];
  selectedIndex: any = [];
  donationServices: any = [];
  customer_label = '';
  donations_count;
  selectedDonations: any;
  show_loc = false;
  locations: any;
  selected_loc_id: any;
  services: any = [];
  selected_location = null;
  screenWidth;
  small_device_display = false;
  selectAll = false;
  filtericonTooltip: any;
  filtericonclearTooltip: any;
  constructor(private provider_services: ProviderServices,
    public dateformat: DateFormatPipe, private provider_shared_functions: ProviderSharedFuctions,
    private routerobj: Router, private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private groupService: GroupStorageService,
    private dateTimeProcessor: DateTimeProcessor,
    private wordProcessor: WordProcessor) {
      this.filtericonTooltip = this.wordProcessor.getProjectMesssages('FILTERICON_TOOPTIP');
  this.filtericonclearTooltip = this.wordProcessor.getProjectMesssages('FILTERICON_CLEARTOOLTIP');
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    this.onResize();
    // this.breadcrumbs_init = [
    //     {
    //         title: this.customer_label.charAt(0).toUpperCase() + this.customer_label.slice(1).toLowerCase() + 's'
    //     }
    // ];
    // this.breadcrumbs = this.breadcrumbs_init;
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
  ngOnInit() {
    const user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.domain = user.sector;
    this.getServiceList();
    this.getLocationList();
    this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
  }
  filterClicked(type) {
    this.filters[type] = !this.filters[type];
    if (!this.filters[type]) {
      if (type === 'date') {
        this.filter[type] = null;
      } else {
        this.filter[type] = '';
      }
      this.doSearch();
    }
  }
  routeLoadIndicator(e) {
    this.apiloading = e;
  }
  performActions(action) {
    if (action === 'learnmore') {
      this.routerobj.navigate(['/provider/' + this.domain + '/donations']);
    }
  }
  redirecToHelp() {
    this.routerobj.navigate(['/provider/' + this.domain + '/donations']);
  }
  gotoLocations() {
    this.routerobj.navigate(['provider', 'settings', 'general', 'locations']);
  }
  getServiceList() {
    const filter1 = { 'serviceType-eq': 'donationService' };
    this.provider_services.getServicesList(filter1)
      .subscribe(
        data => {
          this.donationServices = data;
        },
        () => { }
      );
  }
  //   setFilterData(type, status) {
  //     let passingStatus;
  //     if (status && this.selected === 0) {
  //       this.selected = 1;
  //       this.donationServices.push(status);
  //       passingStatus = this.donationServices.toString();
  //       this.filter[type] = passingStatus;
  //       this.doSearch();
  //     } else if (status && this.selected === 1) {
  //       if (this.donationServices.indexOf(status) !== -1) {
  //         const indexofStatus = this.donationServices.indexOf(status);
  //         if (indexofStatus >= 0) {
  //         }
  //         passingStatus = this.donationServices.toString();
  //         this.filter[type] = passingStatus;
  //         if(this.filter[type] === ''){
  //         this.resetFilter();
  //         }
  //         this.doSearch();

  //       }
  //        else {
  //         this.donationServices.push(status);
  //         passingStatus = this.donationServices.toString();
  //         this.filter[type] = passingStatus;
  //         this.doSearch();
  //       }

  //     }
  // }
  setFilterDataCheckbox(type, value, event) {
    this.filter[type] = value;
    const indx = this.services.indexOf(value);
    if (indx === -1) {
      this.services.push(value);
    } else {
      this.services.splice(indx, 1);
    }
    this.doSearch();
  }
  // getDonationsList(from_oninit = false, loc?) {
  //     let filter = this.setFilterForApi();
  //     filter['donationStatus-eq'] = 'SUCCESS';
  //     if (loc && loc.id) {
  //         filter['location-eq'] = loc.id;
  //         this.show_loc = false;
  //     }
  //     this.locationSelected(loc);
  //     this.getDonationsCount(filter)
  //         .then(
  //             result => {
  //                 if (from_oninit) { this.donations_count = result; }
  //                 filter = this.setPaginationFilter(filter);
  //                 this.provider_services.getDonations(filter)
  //                     .subscribe(
  //                         data => {
  //                             console.log(data);
  //                             this.donations = data;
  //                             if (loc && loc.id) {
  //                                 this.selected_loc_id = loc.id;
  //                             }
  //                             this.loadComplete = true;
  //                         },
  //                         error => {
  //                             this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
  //                             this.loadComplete = true;
  //                         }
  //                     );
  //             },
  //             error => {
  //                 this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
  //             }
  //         );
  // }
  getDonationsList(from_oninit = true) {
    this.selectedDonations = [];
    this.donationsSelected = [];
    this.selectAll = false;
    let filter = this.setFilterForApi();
    this.getDonationsCount(filter)
      .then(
        result => {
          if (from_oninit) { this.donations_count = result; }
          filter = this.setPaginationFilter(filter);
          this.provider_services.getDonations(filter)
            .subscribe(
              data => {
                this.donations = data;
                this.loadComplete = true;
              },
              error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                this.loadComplete = true;
              }
            );
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  clearFilter() {
    this.services = [];
    this.resetFilter();
    this.filterapplied = false;
    this.getDonationsList(true);
  }
  getDonationsCount(filter) {
    return new Promise((resolve, reject) => {
      this.provider_services.getDonationsCount(filter)
        .subscribe(
          data => {
            this.pagination.totalCnt = data;
            this.donations_count = this.pagination.totalCnt;
            resolve(data);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  stringtoDate(dt, mod) {
    return this.dateTimeProcessor.stringtoDate(dt, mod);
  }
  toggleFilter() {
    this.open_filter = !this.open_filter;
  }
  handle_pageclick(pg) {
    this.pagination.startpageval = pg;
    this.filter.page = pg;
    this.doSearch();
  }
  doSearch() {
    this.getDonationsList();
    if (this.filter.first_name || this.filter.last_name || this.filter.date || this.filter.service) {
      this.filterapplied = true;
    } else {
      this.filterapplied = false;
    }
  }
  resetFilter() {
    this.filters = {
      'first_name': false,
      'last_name': false,
      'date': false,
      'service': false
    };
    this.filter = {
      first_name: '',
      last_name: '',
      date: null,
      service: '',
      page_count: projectConstants.PERPAGING_LIMIT,
      page: 1
    };
  }
  setPaginationFilter(api_filter) {
    if (this.donations_count <= 10) {
      this.pagination.startpageval = 1;
    }
    api_filter['from'] = (this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.filter.page_count : 0;
    api_filter['count'] = this.filter.page_count;
    return api_filter;
  }
  setFilterForApi() {
    const api_filter = {};
    if (this.filter.first_name !== '') {
      api_filter['donor-like'] = 'firstName::' + this.filter.first_name;
    }
    if (this.filter.last_name !== '') {
      api_filter['donor-like'] = 'lastName::' + this.filter.last_name;
    }
    if (this.filter.date != null) {
      api_filter['date-eq'] = this.dateformat.transformTofilterDate(this.filter.date);
    }
    if (this.services.length > 0) {
      api_filter['service-eq'] = this.services.toString();
    }
    if (this.selected_location && this.selected_location.id) {
      api_filter['location-eq'] = this.selected_location.id;
    }

    return api_filter;
  }
  focusInput(ev, input) {
    const kCode = parseInt(ev.keyCode, 10);
    if (kCode === 13) {
      input.focus();
      this.doSearch();
    }
  }
  showFilterSidebar() {
    this.show_loc = false;
    this.filter_sidebar = true;
  }
  hideFilterSidebar() {
    this.filter_sidebar = false;
  }

  selectDonations(index) {
    this.selectedDonations = [];
    if (this.donationsSelected[index]) {
      delete this.donationsSelected[index];
    } else {
      this.donationsSelected[index] = true;
    }
    for (let i = 0; i < this.donationsSelected.length; i++) {
      if (this.donationsSelected[i]) {
        if (this.selectedDonations.indexOf(this.donations[i]) === -1) {
          this.selectedDonations.push(this.donations[i]);
        }
      }
    }
    if (this.donations.length === this.selectedDonations.length) {
      this.selectAll = true;
    } else {
      this.selectAll = false;
    }
  }
  selectAllDonations() {
    if (!this.selectAll) {
      this.selectAll = true;
      for (let i = 0; i < this.donations.length; i++) {
        this.donationsSelected[i] = true;
        if (this.selectedDonations.indexOf(this.donations[i]) === -1) {
          this.selectedDonations.push(this.donations[i]);
        }
      }
    } else {
      this.selectAll = false;
      this.donationsSelected = [];
      this.selectedDonations = [];
    }
  }
  addInboxMessage() {
    let customerlist = [];
    customerlist = this.selectedDonations;
    this.provider_shared_functions.ConsumerInboxMessage(customerlist, 'donation-list')
      .then(
        () => { },
        () => { }
      );
  }
  getLocationList() {
    const self = this;
    // this.provider_services.getProviderLocations()
    //     .subscribe((data: any) => {
    //         this.locations = data;
    //     }
    //     );
    return new Promise<void>(function (resolve, reject) {
      self.selected_location = null;
      self.provider_services.getProviderLocations()
        .subscribe(
          (data: any) => {
            const locations = data;
            self.locations = [];
            for (const loc of locations) {
              if (loc.status === 'ACTIVE') {
                self.locations.push(loc);
              }
            }
            self.onChangeLocationSelect(self.locations[0]);
            const cookie_location_id = self.groupService.getitemFromGroupStorage('provider_selected_location'); // same in provider checkin button page
            if (cookie_location_id === '') {
              if (self.locations[0]) {
                self.locationSelected(self.locations[0]).then(
                  (schedules: any) => {
                  }
                );
              }
            } else {
              self.selectLocationFromCookies(parseInt(cookie_location_id, 10));
            }
            resolve();
          },
          () => {
            reject();
          },
          () => {
          }
        );
    },
    );
  }
  locationSelected(location) {
    this.selected_location = location;
    // const _this = this;
    if (this.selected_location) {
      this.groupService.setitemToGroupStorage('provider_selected_location', this.selected_location.id);
    }
    this.groupService.setitemToGroupStorage('loc_id', this.selected_location);
    return new Promise(function (resolve, reject) {
    });
  }
  selectLocationFromCookies(cookie_location_id) {
    this.locationSelected(this.selectLocationFromCookie(cookie_location_id)).then(
      (schedules: any) => {
      }
    );
  }
  selectLocationFromCookie(cookie_location_id) {
    let selected_location = null;
    for (const location of this.locations) {
      if (location.id === cookie_location_id) {
        selected_location = location;
      }
    }
    return (selected_location !== null) ? selected_location : this.locations[0];
  }

  showFilterLocation() {
    this.filter_sidebar = false;
    this.show_loc = !this.show_loc;
  }
  onChangeLocationSelect(location) {
    this.selected_location = location;
    this.getDonationsList();
  }
  showConsumerNote(donation) {
    const notedialogRef = this.dialog.open(ProviderWaitlistCheckInConsumerNoteComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        checkin: donation,
        type: 'donation'
      }
    });
    notedialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {
      }
    });
  }
  stopprop(event) {
    event.stopPropagation();
  }
  gotoDonation(donation) {
    this.routerobj.navigate(['provider', 'donations', donation.uid]);
  }
}

