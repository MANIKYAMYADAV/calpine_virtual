import { Component, OnInit } from '@angular/core';

import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';

import { SharedFunctions } from '../../../../shared/functions/shared-functions';

import { projectConstants } from '../../../../shared/constants/project-constants';

import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';

import { linkProfileComponent } from './linkProfile/linkProfile.component';

import { MatDialog } from '@angular/material';



@Component({

    'selector': 'app-branchusers',

    'templateUrl': './users.component.html'

})

export class BranchUsersComponent implements OnInit {

    users_list: any = [];

    breadcrumb_moreoptions: any = [];

    domain;

    filter_sidebar = false;

    filterapplied = false;

    open_filter = false;

    filter = {

        id: '',

        firstName: '',

        mobileNo: '',

        userType: '',

        page_count: projectConstants.PERPAGING_LIMIT,

        page: 1

    }; 

    filters: any = {

        'id': false,

        'firstName': false,

        'mobileNo': false,

        'userType': false

        

       

    };

    breadcrumbs = [

        {

            url: '/provider/settings',

            title: 'Settings'

        },

        {

            url: '/provider/settings/miscellaneous',

            title: 'Miscellaneous'

        },

        {

            title: 'Users'

        }

    ];

    userTypesFormfill: any = ['ASSISTANT', 'PROVIDER'];

    api_loading: boolean;

    departments: any;

    loadComplete = false;

    user_count: any = 0;

    pagination: any = {

        startpageval: 1,

        totalCnt: 0,

        perPage: this.filter.page_count

    };

    linkprofiledialogRef;

    provId;

    

    businessConfig: any;

    

    constructor(

        private router: Router,

        private routerobj: Router,

        private provider_services: ProviderServices,

        private dialog:MatDialog,

        private activated_route: ActivatedRoute,

        private shared_functions: SharedFunctions) {



    }

    ngOnInit() {

        const user = this.shared_functions.getitemFromGroupStorage('ynw-user');

        this.domain = user.sector;

        this.api_loading = true;

        this.getUsers();

        this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };

    }

    addBranchSP() {



        const navigationExtras: NavigationExtras = {

            queryParams: { type: 'Add' }

        };



        this.router.navigate(['provider', 'settings', 'miscellaneous', 'users', 'add'], navigationExtras);

    }

    personalProfile(user) {

        console.log(user);

        const navigationExtras: NavigationExtras = {

            queryParams: {

                type: 'edit',

                val: user

            }

        };

        console.log(navigationExtras);

        this.router.navigate(['provider', 'settings', 'miscellaneous', 'users', 'add'], navigationExtras);

    }

    manageOnlineProfile(userId) {

        this.routerobj.navigate(['provider', 'settings', 'miscellaneous', 'users', userId, 'bprofile']);

    }

    manageSettings(userId) {

        this.routerobj.navigate(['provider', 'settings', 'miscellaneous', 'users', userId, 'settings']);

    }



    



     



  linkProfile(userid){

     console.log(userid);

     

   this.linkprofiledialogRef=this.dialog.open(linkProfileComponent,{

       width:'50%',

       data:{

        provId:userid

       },

       panelClass:['popup-class', 'commonpopupmainclass'],

       autoFocus:true,

       disableClose:true

   });

   this.linkprofiledialogRef.afterClosed().subscribe((result) => {

    if (result) {

            if (result === 'reloadlist') {

                this.getUsers();

     

            }

            }

});

   

     

  }



    changeUserStatus(user) {

        let passingStatus;

        if (user.status === 'ACTIVE') {

            passingStatus = 'Disable';

        } else {

            passingStatus = 'Enable';

        }

        this.provider_services.disableEnableuser(user.id, passingStatus)

            .subscribe(

                () => {

                    this.getUsers();

                },

                (error) => {

                    this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });

                    this.getUsers();

                });

    }

    getUsers(from_oninit = false) {

        let filter = this.setFilterForApi();

        this.getUsersListCount(filter)

            .then(

                 result => {

                     if (from_oninit) { this.user_count = result; }

                        filter = this.setPaginationFilter(filter);

                            this.provider_services.getUsers(filter).subscribe(

                            (data: any) => {

                                this.provider_services.getDepartments().subscribe(

                                    (data1: any) => {

                                        this.departments = data1.departments;

                                        this.users_list = data;

                                        this.api_loading = false;

                                        this.loadComplete = true;

                                    },

                                    (error: any) => {

                                        this.users_list = data;

                                        this.api_loading = false;

                                        this.loadComplete = true;

                                    });

                            },

                            (error: any) => {

                                this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });

                            });

                        },

                        (error: any) => {

                            this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });

                        });

    }

    getDepartmentNamebyId(id) {

        let departmentName;

        for (let i = 0; i < this.departments.length; i++) {

            if (this.departments[i].departmentId === id) {

                departmentName = this.departments[i].departmentName;

                break;

            }

        }

        return departmentName;

    }

    performActions(action) {

        if (action === 'learnmore') {

            this.routerobj.navigate(['/provider/' + this.domain + '/miscellaneous->branchsps']);

        }

    }

    showFilterSidebar() {

        this.filter_sidebar = true;

    }

    hideFilterSidebar() {

        this.filter_sidebar = false;

    }

    clearFilter() {

        this.resetFilter();

        this.filterapplied = false;

        this.getUsers();

    }

    resetFilter() {

        this.filters = {

            'firstName': false,

            'id': false,

            'mobileNo': false,

            'userType': false

        };

        this.filter = {

            id: null,

            firstName: '',

            mobileNo: '',

            userType: '',

            page_count: projectConstants.PERPAGING_LIMIT,

            page: 1

        };

    }

    doSearch() {

        this.getUsers();

        if (this.filter.firstName || this.filter.id || this.filter.mobileNo || this.filter.userType) {

            this.filterapplied = true;

        } else {

            this.filterapplied = false;

        }

    }

    focusInput(ev, input) {

        const kCode = parseInt(ev.keyCode, 10);

        if (kCode === 13) {

            input.focus();

            this.doSearch();

        }

    }

    setPaginationFilter(api_filter) {



        api_filter['from'] = (this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.filter.page_count : 0;

        api_filter['count'] = this.filter.page_count;

        return api_filter;

    }

    setFilterForApi() {

        const api_filter = {};

        if (this.filter.firstName !== '') {

            api_filter['firstName-eq'] = this.filter.firstName;

        }

        if (this.filter.userType !== '') {

            api_filter['userType-eq'] = this.filter.userType;

        }

        if (this.filter.mobileNo !== '') {

            const pattern = projectConstants.VALIDATOR_NUMBERONLY;

            const mval = pattern.test(this.filter.mobileNo);

            if (mval) {

                api_filter['mobileNo-eq'] = this.filter.mobileNo;

            } else {

                this.filter.mobileNo = '';

            }

        }

        return api_filter;

    }



    getUsersListCount(filter) {

        return new Promise((resolve, reject) => {

            this.provider_services.getUsersCount(filter)

                .subscribe(

                    data => {

                        this.pagination.totalCnt = data;

                        this.user_count = this.pagination.totalCnt;

                        resolve(data);

                    },

                    error => {

                        reject(error);

                    }

                );

        });

    }



}