import { Component, OnInit } from '@angular/core';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';

@Component({
    'selector': 'app-doctorusers',
    'templateUrl': './doctors.component.html'
})
export class DoctorsComponent implements OnInit {
    users_list: any = [];
    breadcrumb_moreoptions: any = [];
    domain;
    userType;
    userlistSelected: any = [];
    userlistSelection = 0;
    selectedUserlist: any = [];
    new_users_list: any = [];
    profileStatus = false;
    breadcrumbs = [
        {
            url: '/provider/settings',
            title: 'Settings'
        },
        {
            url: '/provider/settings/users',
            title: 'Users'
        },
        {
            title: 'Doctors/Assistants'
        }
    ];
    api_loading: boolean;
    constructor(
        private router: Router,
        private routerobj: Router,
        private shared_services: ProviderServices,
        private activatedRoot:ActivatedRoute,
        private shared_functions: SharedFunctions) {
            this.activatedRoot.queryParams.subscribe(data => {
                this.userType = data;
            });

    }
    ngOnInit() {
        const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
        this.api_loading = true;
        this.getBranchSPs();
        this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
    }
    addBranchSP(usertype,usermode) {
        console.log(usermode);
        const navigationExtras: NavigationExtras = {
            queryParams: { type: usertype,
                            mode : usermode
             }
        };
        this.routerobj.navigate(['provider', 'settings', 'users', 'doctors', 'add'], navigationExtras);
        //this.router.navigate(['provider', 'settings', 'users', 'doctors', 'add']);
    }
    getBranchSPs() {
        const accountId = this.shared_functions.getitemFromGroupStorage('accountId');
        const users = [];
        this.shared_services.getBranchSPs(accountId).subscribe(
            (data: any) => {
                this.users_list = data;
                for (let i = 0; i < this.users_list.length; i++) {
                    if (this.users_list[i]['accountType'] === 'BRANCH') {
                    } else {
                        users.push(this.users_list[i]);
                    }
                }
                this.users_list = users;
                this.api_loading = false;
                console.log(this.users_list);
            }
        );
    }
    // gotoBranchspDetails(user) {
    //      console.log(user);
    // }
    manageProvider(accountId,mode) {
        const navigationExtras: NavigationExtras = {
            queryParams: { type: accountId,
                            mode : mode
             }
        };
        //this.router.navigate(['provider', 'settings', 'users', 'doctors', 'add'], navigationExtras);
        this.routerobj.navigate(['provider', 'settings', 'users', 'doctors', 'add'], navigationExtras);
       // window.open('#/manage/' + accountId, '_blank');
    }
    performActions(action) {
        if (action === 'learnmore') {
          this.routerobj.navigate(['/provider/' + this.domain + '/miscellaneous->branchsps']);
        }
      }

      selectUserlist(index) {
        if (this.userlistSelected[index]) {
          delete this.userlistSelected[index];
          this.userlistSelection--;
        } else {
          this.userlistSelected[index] = true;
          this.userlistSelection++;
        }
        if (this.userlistSelection === 1) {
            this.selectedUserlist = this.users_list[this.userlistSelected.indexOf(true)];
            console.log(this.selectedUserlist);
            this.profileStatus = true;

        } else {
            this.profileStatus = false;
        }
    }
    deleteUser() {
        this.shared_services.deleteUser(this.selectedUserlist.id).subscribe(data => {
        this.shared_functions.openSnackBar(this.shared_functions.getProjectMesssages('BRANCHUSER_DELETED'), { 'panelclass': 'snackbarerror' });                  
        }, error => {
                this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            });
    }
    userProfile(info) {
        this.routerobj.navigate(['provider', 'settings', 'bprofile', 'additionalinfo']);
    }
}
