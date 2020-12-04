import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SharedFunctions } from '../../functions/shared-functions';
import { projectConstants } from '../../../app.component';
import { Messages } from '../../constants/project-messages';
@Component({
    'selector': 'app-card',
    'templateUrl': './card.component.html',
    'styleUrls': ['./card.component.css']
})
export class CardComponent implements OnInit {
    @Input() item;
    @Input() terminology;
    @Input() loc;
    @Output() actionPerformed = new EventEmitter<any>();
    service: any;
    user: any;
    timingCaption: string;
    timings: string;
    server_date;
    buttonCaption = Messages.GET_TOKEN;
    waitinglineCap = Messages.WAITINGLINE;
    personsAheadText = '';
    constructor(private sharedFunctons: SharedFunctions) {
        this.server_date = this.sharedFunctons.getitemfromLocalStorage('sysdate');
    }

    ngOnInit() {
        console.log(this.item.type);
        if (this.item.type === 'waitlist') {
            this.service = this.item.item;
            this.personsAheadText = 'People in line : ' + this.service.serviceAvailability['personAhead'];
            if (this.service.serviceAvailability['showToken']) {
            } else {
                this.buttonCaption = 'Get ' + this.getTerminologyTerm('waitlist')
            }
            if (this.service.serviceAvailability['calculationMode'] != 'NoCalc') {
                if (this.service.serviceAvailability['serviceTime']) {
                    this.timingCaption = 'Next Available Time';
                    this.timings = this.getAvailibilityForCheckin(this.service.serviceAvailability['availableDate'], this.service.serviceAvailability['serviceTime'])
                } else {
                    this.timingCaption = 'Est Wait Time';
                    this.timings = this.getTimeToDisplay(this.service.serviceAvailability['queueWaitingTime']);
                }
            }
        } else if (this.item.type === 'appt') {
            this.service = this.item.item;
            this.timingCaption = 'Next Available Time';
            this.timings = this.getAvailabilityforAppt(this.service.serviceAvailability.nextAvailableDate, this.service.serviceAvailability.nextAvailable);
            this.buttonCaption = 'Get Appointment';
        } else if (this.item.type === 'donation') {
            this.service = this.item.item;
            console.log(this.service);
            this.buttonCaption = 'Donate'
        }else {
            this.user = this.item.item;
        }
    }
    cardActionPerformed(type, action, service, location, userId, event) {
        console.log(location);
        event.stopPropagation();
        const actionObj = {};
        actionObj['type'] = type;
        actionObj['action'] = action;
        if (service) {
            actionObj['service'] = service;
        }
        if (location) {
            actionObj['location'] = location;
        }
        if (userId) {
            actionObj['userId'] = userId;
        }
        console.log(actionObj);
        this.actionPerformed.emit(actionObj);
    }
    getTerminologyTerm(term) {
        const term_only = term.replace(/[\[\]']/g, ''); // term may me with or without '[' ']'
        if (this.terminology) {
            return this.sharedFunctons.firstToUpper((this.terminology[term_only]) ? this.terminology[term_only] : ((term === term_only) ? term_only : term));
        } else {
            return this.sharedFunctons.firstToUpper((term === term_only) ? term_only : term);
        }
    }
    getTimeToDisplay(min) {
        return this.sharedFunctons.convertMinutesToHourMinute(min);
    }
    getAvailibilityForCheckin(date, serviceTime) {
        const todaydt = new Date(this.server_date.split(' ')[0]).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const today = new Date(todaydt);
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
        if (dtoday === date) {
            return ('Today' + ', ' + serviceTime);
        } else {
            return (this.sharedFunctons.formatDate(date, { 'rettype': 'monthname' }) + ', '
                + serviceTime);
        }
    }
    getAvailabilityforAppt(date, time) {
        const todaydt = new Date(this.server_date.split(' ')[0]).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const today = new Date(todaydt);
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
        if (dtoday === date) {
            return ('Today' + ', ' + this.getSingleTime(time));
        } else {
            return (this.sharedFunctons.formatDate(date, { 'rettype': 'monthname' }) + ', '
                + this.getSingleTime(time));
        }
    }
    getSingleTime(slot) {
        const slots = slot.split('-');
        return this.sharedFunctons.convert24HourtoAmPm(slots[0]);
    }
    getAvailableSlot(slots) {
        let slotAvailable = '';
        for (let i = 0; i < slots.length; i++) {
            if (slots[i].active) {
                slotAvailable = this.getSingleTime(slots[i].time);
                break;
            }
        }
        return slotAvailable;
    }
    getPic(user) {
        if (user.profilePicture) {
            // alert(JSON.parse(user.profilePicture)['url']);
            return JSON.parse(user.profilePicture)['url'];
        }
        return 'assets/images/img-null.svg';
    }
}