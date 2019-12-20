import { Component, OnInit, HostListener, ViewChildren, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { Subscription, Observable } from 'rxjs';

@Component({
    selector: 'app-displayboard-content',
    templateUrl: './displayboard-content.component.html'
})
export class DisplayboardLayoutContentComponent implements OnInit, OnDestroy {
    layout_id;
    boardLayouts = [
        { displayName: '1x1', value: '1_1', row: 1, col: 1 },
        { displayName: '1x2', value: '1_2', row: 1, col: 2 },
        { displayName: '2x1', value: '2_1', row: 2, col: 1 },
        { displayName: '2x2', value: '2_2', row: 2, col: 2 }
    ];
    boardRows: any;
    boardCols: any;
    selectedDisplayboards: any = {};
    boardHeight;
    bname;
    blogo;
    metricElement;
    cronHandle: Subscription;
    @ViewChildren('boardid') private boardstyle;
    MainBlogo;
    bProfile: any = [];
    qualification: any = [];
    subDomVirtualFields: any = [];
    constructor(private activated_route: ActivatedRoute,
        private provider_services: ProviderServices,
        private shared_functions: SharedFunctions) {
        this.onResize();
        this.activated_route.params.subscribe(
            qparams => {
                this.layout_id = qparams.id;
            });
    }
    @HostListener('window:resize', ['$event'])
    onResize(event?) {
        const screenHeight = window.innerHeight;
        this.boardHeight = (screenHeight - 150) / 2;
    }
    ngOnDestroy() {
        if (this.cronHandle) {
            this.cronHandle.unsubscribe();
        }
    }
    ngOnInit() {
        this.getBusinessProfile();
        this.getBusinessdetFromLocalstorage();
        if (this.layout_id) {
            let layoutData;
            this.provider_services.getDisplayboard(this.layout_id).subscribe(
                layoutInfo => {
                    layoutData = layoutInfo;
                    const layoutPosition = layoutData.layout.split('_');
                    this.boardRows = layoutPosition[0];
                    this.boardCols = layoutPosition[1];
                    layoutData.metric.forEach(element => {
                        this.metricElement = element;
                        this.selectedDisplayboards[element.position] = {};
                        this.setDisplayboards(element);
                    });
                });
        }
        this.cronHandle = Observable.interval(30000).subscribe(() => {
            this.setDisplayboards(this.metricElement);
        });
    }

    getBusinessdetFromLocalstorage() {
        const MainBdetails = this.shared_functions.getitemFromGroupStorage('ynwbp', 'branch');
        const bdetails = this.shared_functions.getitemFromGroupStorage('ynwbp');
        if (bdetails) {
            this.bname = bdetails.bn || '';
            this.blogo = bdetails.logo || '';
        }
        if (MainBdetails) {
            // this.MainBname = MainBdetails.bn || '';
            this.MainBlogo = MainBdetails.logo || '';
        }
    }

    getFieldValue(field, checkin) {
        let fieldValue = '';
        if (field.name === 'waitlistingFor') {
            fieldValue = checkin[field.name][0].firstName + ' ' + checkin[field.name][0].lastName;
        } else if (field.name === 'appxWaitingTime') {
            return this.shared_functions.providerConvertMinutesToHourMinute(checkin[field.name]);
        } else if (field.name === 'service') {
            fieldValue = checkin[field.name].name;
        } else if (field.name === 'queue') {
            fieldValue = checkin[field.name].queueStartTime + ' - ' + checkin[field.name].queueEndTime;
        } else if (field.label === true) {
            if (checkin.label[field.name]) {
                fieldValue = checkin.label[field.name];
            } else {
                fieldValue = field.defaultValue;
            }
        } else if (field.name === 'primaryMobileNo') {
            fieldValue = checkin['waitlistingFor'][0]['primaryMobileNo'];
        } else {
            fieldValue = checkin[field.name];
        }
        return fieldValue;
    }
    setDisplayboards(element) {
        this.provider_services.getDisplayboardQSetbyId(element.sbId).subscribe(
            (displayboard) => {
                this.selectedDisplayboards[element.position]['board'] = displayboard;
                const Mfilter = this.setFilterForApi(displayboard);
                this.provider_services.getTodayWaitlist(Mfilter).subscribe(
                    (waitlist) => {
                        this.selectedDisplayboards[element.position]['checkins'] = waitlist;
                    });
            });
    }
    createRange(number) {
        const items = [];
        for (let i = 0; i < number; i++) {
            items.push(i);
        }
        return items;
    }
    setFilterForApi(layout) {
        const api_filter = {};
        layout.queueSetFor.forEach(element => {
            if (element.type === 'SERVICE') {
                api_filter['service-eq'] = element.id[0];
            } else if (element.type === 'QUEUE') {
                api_filter['queue-eq'] = element.id[0];
            } else {
                api_filter['department-eq'] = element.id[0];
            }
            api_filter['waitlistStatus-eq'] = 'arrived,checkedIn,started';
        });
        return api_filter;
    }
    getBusinessProfile() {
        this.provider_services.getBussinessProfile()
            .subscribe(
                data => {
                    this.bProfile = data;
                    this.getQualification(this.bProfile.subDomainVirtualFields[0]);
                });
    }
    getQualification(list) {
        const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
        const virtualfields = list[user.subSector];
        this.provider_services.getVirtualFields(user.sector, user.subSector).subscribe(data => {
            this.subDomVirtualFields = data;
            for (let i = 0; i < this.subDomVirtualFields.length; i++) {
                if (this.subDomVirtualFields[i].baseField === 'qualification') {
                    const eduName = this.subDomVirtualFields[i]['name'];
                    this.qualification = virtualfields[eduName];
                }
            }
        });
    }
}
