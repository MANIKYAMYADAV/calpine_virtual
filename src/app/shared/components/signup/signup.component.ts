import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {FormMessageDisplayService} from '../../modules/form-message-display/form-message-display.service';
import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';
import { projectConstants } from '../../../shared/constants/project-constants';
import {Messages} from '../../constants/project-messages';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  // styleUrls: ['./home.component.scss']
})
export class SignUpComponent implements OnInit {

  business_domains ;
  packages ;
  subDomainList = [];
  dropdownSettings = {
                        singleSelection: false,
                        text: 'Select Sub Sector',
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        classes: 'myclass custom-class'
                      };
  selectedDomain = null;
  signupForm: FormGroup;
  api_error = null;
  api_success = null;
  is_provider = 'true';
  step = 1;
  otp = null;
  user_details;
  domainIsthere;
  selectedpackage;
  heading = 'Activation Process';
  constructor(
    public dialogRef: MatDialogRef<SignUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public shared_services: SharedServices,
    public shared_functions: SharedFunctions
    ) {
        this.is_provider = data.is_provider || 'true';
        console.log('signup', data);
     }

     ngOnInit() {
      this.shared_functions.removeitemfromLocalStorage('ynw-createprov');
      if (this.data.moreOptions === undefined) {
        this.data.moreOptions = { isCreateProv: false};
      }
      if (this.data.moreOptions && this.data.moreOptions.isCreateProv) {
        this.heading = 'Create Provider Account';
        this.createFormSpecial(1);
      } else {
          this.createForm(1);
      }
        this.shared_services.bussinessDomains()
        .subscribe(
          data => {
              this.business_domains = data;
             // this.setDomain(0);
          },
          error => {
              console.log(error);
          }
        );

        this.shared_services.getPackages()
        .subscribe(
          data => {
            this.packages = data;

            if (this.packages[0] && this.signupForm.get('package_id')) {
              this.signupForm.get('package_id').setValue(this.packages[0].pkgId);
            }
          },
          error => {

          }
        );
     }

     createForm(step) {
      this.step = step;
      switch (step) {
        case 1:  this.signupForm = this.fb.group({
                          is_provider: ['true'],
                          phonenumber: ['', Validators.compose(
                                            [Validators.required,  Validators.maxLength(10), Validators.minLength(10), Validators.pattern(projectConstants.VALIDATOR_NUMBERONLY)]) ],
                          first_name: ['', Validators.compose([Validators.required, Validators.pattern(projectConstants.VALIDATOR_CHARONLY)])],
                          last_name: ['', Validators.compose([Validators.required, Validators.pattern(projectConstants.VALIDATOR_CHARONLY)])],
                          selectedDomainIndex: ['', Validators.compose([Validators.required])],
                          selectedSubDomains: [0, Validators.compose([Validators.required])],
                          package_id : ['', Validators.compose([Validators.required])],
                          terms_condition: ['true'],

                 });
                 this.signupForm.get('is_provider').setValue(this.is_provider);
                 this.changeType();

                 break;
      }


     }

     createFormSpecial(step) {
      this.step = step;
      switch (step) {
        case 1:  this.signupForm = this.fb.group({
                          is_provider: ['true'],
                          selectedDomainIndex: ['', Validators.compose([Validators.required])],
                          selectedSubDomains: [0, Validators.compose([Validators.required])],
                          package_id : ['', Validators.compose([Validators.required])],
                          terms_condition: ['true'],

                 });
                 this.signupForm.get('is_provider').setValue(this.is_provider);
                 this.changeType();

                 break;
      }


     }

     changeType() {
       this.resetApiErrors();
       this.is_provider = this.signupForm.get('is_provider').value;

       if (this.is_provider === 'true') {
        this.resetValidation(['selectedSubDomains', 'selectedDomainIndex', 'package_id']);
       } else {
        this.resetValidation(['selectedSubDomains', 'selectedDomainIndex', 'package_id']);
       }

     }

     resetValidation(control_names) {
        // only for  this form
       // console.log(this.is_provider);
        if (this.is_provider === 'true') {
          control_names.map(control_name => {
            this.signupForm.get(control_name).setValidators(Validators.required);
            this.signupForm.get(control_name).updateValueAndValidity();
          });
        } else {
          control_names.map(control_name => {
            this.signupForm.get(control_name).setValidators(null);
            this.signupForm.get(control_name).updateValueAndValidity();
          });
        }

     }

     setDomain(i) {

     /*if (this.signupForm.get('selectedDomainIndex').value !== i) {
          this.signupForm.get('selectedDomainIndex').setValue(i);
      }*/
      this.domainIsthere = this.business_domains[i] || null;
      this.selectedDomain = this.business_domains[i] || null;
      this.setSubDomains(i);
     }

     setSubDomains(i) {
      this.subDomainList = [];
      const sub_domains = (this.business_domains[i]) ?  this.business_domains[i]['subDomains'] : [];
     // console.log('subdomains', sub_domains);
      sub_domains.forEach((element, index) => {
       // console.log('subid ', index);
        const ob = {'id': index , 'itemName': element.displayName , 'value': element.subDomain};
        this.subDomainList.push(ob);
      });
      this.signupForm.get('selectedSubDomains').setValue(0);
      /*console.log('first subdom', this.subDomainList[0]['value']);
      this.signupForm.setValue({selectedSubDomains: this.subDomainList[0]['id']});*/
     }

     onItemSelect(item: any) {
      // console.log(item);
      // console.log(this.signupForm.get('selectedSubDomains').value);

     }

     onSubmit() {
      this.resetApiErrors();
      this.user_details = {};
      let userProfile = {
        countryCode: '+91',
        primaryMobileNo: null, // this.signupForm.get('phonenumber').value || null,
        firstName: null,
        lastName: null
      };
      if (this.data.moreOptions.isCreateProv) {
        userProfile = {
          countryCode: '+91',
          primaryMobileNo: this.data.moreOptions.dataCreateProv.ph || null, // this.signupForm.get('phonenumber').value || null,
          firstName: this.data.moreOptions.dataCreateProv.fname || null,
          lastName: this.data.moreOptions.dataCreateProv.lname || null
        };
      } else {
        userProfile = {
          countryCode: '+91',
          primaryMobileNo: this.signupForm.get('phonenumber').value || null,
          firstName: this.signupForm.get('first_name').value || null,
          lastName: this.signupForm.get('last_name').value || null,
          // licensePackage: this.signupForm.get('package_id').value || null,
        };
    }



      const isAdmin = (this.signupForm.get('is_provider').value === 'true') ? true : false;

      if (isAdmin) {

        const sector =  this.selectedDomain.domain || '';

        // const ob = this.signupForm.get('selectedSubDomains').value;
        // const sub_Sector = ob.map(el =>  el.value );
        const sub_Sector = this.subDomainList[this.signupForm.get('selectedSubDomains').value].value;
        // console.log('subsector', sub_Sector);


        this.user_details = {
            userProfile: userProfile,
            sector: sector,
            subSector: sub_Sector,
            isAdmin : isAdmin, // checked this to find provider or customer
            licPkgId: this.signupForm.get('package_id').value || null
        };
      //  console.log('providerdet', this.user_details);
        this.signUpApiProvider(this.user_details);

      } else {

        this.user_details = {
          userProfile : userProfile
        };

        this.signUpApiConsumer( this.user_details);

      }




     }

    signUpApiConsumer(user_details) {

      this.shared_services.signUpConsumer(user_details)
      .subscribe(
        data => {
           // console.log(data);
            this.createForm(2);
        },
        error => {
            console.log(error);
            this.api_error = error.error;
        }
      );

    }

    signUpApiProvider(user_details) {

      this.resetApiErrors();

      console.log(user_details);
      this.shared_services.signUpProvider(user_details)
      .subscribe(
        data => {
            console.log(user_details);
            this.createForm(2);
            if (user_details.userProfile &&
              user_details.userProfile.email) {

                this.setMessage('email', user_details.userProfile.email);
              } else {
                this.setMessage('mobile', user_details.userProfile.primaryMobileNo);
              }
        },
        error => {
            console.log(error);
            this.api_error = error.error;
        }
      );

    }


    onOtpSubmit(submit_data) {
      this.resetApiErrors();
      if (this.is_provider === 'true') {
              this.shared_services.OtpSignUpProviderValidate(submit_data.phone_otp)
              .subscribe(
                data => {
                  this.otp = submit_data.phone_otp;
                  this.createForm(3);
                },
                error => {
                  console.log(error);
                  this.api_error = error.error;
                }
              );
      } else {
          this.shared_services.OtpSignUpConsumerValidate(submit_data.phone_otp)
          .subscribe(
            data => {
              this.otp = submit_data.phone_otp;
              this.createForm(3);
            },
            error => {
              console.log(error);
              this.api_error = error.error;
            }
          );
      }

    }

    onPasswordSubmit(submit_data) {
      this.resetApiErrors();
      const post_data = { password: submit_data.new_password };

      if (this.is_provider === 'true') {
        this.shared_services.ProviderSetPassword(this.otp, post_data)
        .subscribe(
          data => {
            const login_data = {
              'countryCode': '+91',
              'loginId': this.user_details.userProfile.primaryMobileNo,
              'password': post_data.password
            };
            this.dialogRef.close();
            this.shared_functions.setitemonLocalStorage('new_provider', 'true');

            this.shared_functions.providerLogin(login_data);
          },
          error => {
            console.log(error);
            this.api_error = error.error;
          }
        );
      } else {
          this.shared_services.ConsumerSetPassword(this.otp, post_data)
          .subscribe(
            data => {
              const login_data = {
                'countryCode': '+91',
                'loginId': this.user_details.userProfile.primaryMobileNo,
                'password': post_data.password
              };
              this.dialogRef.close();
              this.shared_functions.consumerLogin(login_data);
            },
            error => {
              console.log(error);
              this.api_error = error.error;
            }
          );
      }

    }

    resetApiErrors() {
      this.api_error = null;
      this.api_success = null;
    }

    resendOtp(user_details) {

     if (user_details.isAdmin) {

      this.signUpApiProvider(user_details);
     } else {
      this.signUpApiConsumer(user_details);
     }

    }
    clickedPackage(e) {
      // console.log('here', e);
      this.selectedpackage = e;
    }
    isSelectedClass(id) {
      if (id === this.signupForm.get('package_id').value) {
        return true;
      } else {
        return false;
      }
    }

    setMessage (type, data) {

      if (type === 'email') {
        const email = (data) ? data : 'your email';
        this.api_success  = Messages.OTP_SENT_EMAIL.replace('[your_email]', email);
      } else if (type === 'mobile') {
        const phonenumber = (data) ? data : 'your mobile number';
        this.api_success = Messages.OTP_SENT_MOBILE.replace('[your_mobile]', phonenumber);
      }

    }
}
