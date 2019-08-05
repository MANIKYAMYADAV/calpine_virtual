
import { of as observableOf } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { delay } from 'rxjs/operators/delay';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../../shared//modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../services/provider-services.service';
import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../shared/constants/project-constants';
import { Router } from '@angular/router';
import { Image } from 'angular-modal-gallery';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
@Component({
  selector: 'app-addprovider-wailist-service',
  templateUrl: './add-provider-waitlist-service.component.html'
})

export class AddProviderWaitlistServiceComponent implements OnInit {

  service_cap = Messages.PRO_SERVICE_CAP;
  description_cap = Messages.DESCRIPTION_CAP;
  price_cap = Messages.PRICE_CAP;
  service_name_cap = Messages.SERVICE_NAME_CAP;
  est_duration_cap = Messages.EST_DURATION_CAP;
  enable_prepayment_cap = Messages.ENABLE_PREPAYMENT_CAP;
  prepayment_cap = Messages.PREPAYMENT_CAP;
  tax_applicable_cap = Messages.TAX_APPLICABLE_CAP;
  service_notify_cap = '';
  push_message_cap = Messages.PUSH_MESSAGE_CAP;
  service_email_cap = Messages.SERVICE_EMAIL_CAP;
  gallery_cap = Messages.GALLERY_CAP;
  select_image_cap = Messages.SELECT_IMAGE_CAP;
  go_to_service_cap = Messages.GO_TO_SERVICE_CAP;
  delete_btn = Messages.DELETE_BTN;
  cancel_btn = Messages.CANCEL_BTN;
  service_price_cap = Messages.SERVPRICE_CAP;
  rupee_symbol = '₹';
  amForm: FormGroup;
  api_error = null;
  api_success = null;
  error_msg = null;
  number_decimal_pattern = '^[0-9]+\.?[0-9]*$';
  number_pattern = projectConstants.VALIDATOR_NUMBERONLY;
  service;
  base_licence = false;
  api_loading = true;
  api_loading1 = true;
  gallery: any = [];
  images: Observable<Array<Image>>;
  openModalWindow = false;
  imagePointer = 0;
  char_count = 0;
  max_char_count = 500;
  isfocused = false;
  item_pic = {
    files: [],
    base64: [],
    caption: []
  };
  success_error = null;
  error_list = [];
  type = 'add';
  button_title = 'Save';
  payment_loading = false;
  payment_settings: any = [];
  tooltip = Messages.NEW_SERVICE_TOOLTIP;
  mode = 'normal';
  normaladd_msg1 = this.shared_functions.getProjectMesssages('SERVICE_ADDED1');
  normaladd_msg2 = this.shared_functions.getProjectMesssages('SERVICE_ADDED2');
  taxDetails: any = [];
  taxpercentage = 0;
  savedisabled = false;
  canceldisabled = false;
  customer_label = '';
  isServiceBillable = false;
  isloading = false;
  disablebutton = false;
  departmentlist: any = [];
  filterDepart = false;
  departments: any = [];
  deptLength;
  selected_dept;
  businessjson: any = [];
  provider_id;
  s3url;
  servicesjson: any = [];
  serviceslist: any = [];
  services: any = [];
  sel_ser;
  loading = true;
  deptObj;
  constructor(
    public dialogRef: MatDialogRef<AddProviderWaitlistServiceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    public shared_functions: SharedFunctions,
    public router: Router,
    private sharedfunctionObj: SharedFunctions,
    public shared_services: SharedServices,
  ) {
    this.customer_label = this.sharedfunctionObj.getTerminologyTerm('customer');
  }

  ngOnInit() {
    this.getDomainSubdomainSettings();
    // this.getDepartments();
    this.api_loading = false;
    this.service_notify_cap = Messages.SERVICE_NOTIFY_CAP.replace('[customer]', this.customer_label);
    const user = this.shared_functions.getitemfromLocalStorage('ynw-user');
    this.type = this.data.type;
    //  this.base_licence = (package_id === 1) ? true : false;
  }
  setDescFocus() {
    this.isfocused = true;
    this.char_count = this.max_char_count - this.amForm.get('description').value.length;
  }
  lostDescFocus() {
    this.isfocused = false;
  }
  setCharCount() {
    this.char_count = this.max_char_count - this.amForm.get('description').value.length;
  }
  getGalleryImages() {
    const service_id = this.service.id;
    this.provider_services.getServiceGallery(service_id)
      .subscribe(
        data => {
          this.gallery = data;
          this.loadGalleryImages(this.gallery);
        },
        () => {

        }
      );
  }
  getTaxpercentage() {
    this.provider_services.getTaxpercentage()
      .subscribe(data => {
        this.taxDetails = data;
        if (this.taxDetails) {
          this.taxpercentage = this.taxDetails.taxPercentage;
        }
      },
        () => {

        });
  }

  taxapplicableChange() {
    if (this.taxpercentage <= 0) {
      this.api_error = this.shared_functions.getProjectMesssages('SERVICE_TAX_ZERO_ERROR');
      setTimeout(() => {
        this.api_error = null;
      }, projectConstants.TIMEOUT_DELAY_LARGE);
      this.amForm.get('taxable').setValue(false);
    } else {
      this.api_error = null;
    }
  }

  createForm() {
    this.getDepartments();
    if (!this.isServiceBillable) {
      this.amForm = this.fb.group({
        name: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
        description: ['', Validators.compose([Validators.maxLength(500)])],
        department: ['', Validators.compose([Validators.maxLength(500)])],
        // serviceDuration: ['', Validators.compose([Validators.required, Validators.pattern(this.number_decimal_pattern)])],
        serviceDuration: ['', Validators.compose([Validators.required, Validators.pattern(this.number_pattern), Validators.maxLength(10)])],
        // totalAmount: ['', Validators.compose([Validators.required, Validators.pattern(this.number_decimal_pattern), Validators.maxLength(10)])],
        // isPrePayment: [{'value': false , 'disabled': this.base_licence }],
        // taxable: [false],
        notification: [false]
      });
    } else {
      this.amForm = this.fb.group({
        name: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
        description: ['', Validators.compose([Validators.maxLength(500)])],
        department: ['', Validators.compose([Validators.maxLength(500)])],
        // serviceDuration: ['', Validators.compose([Validators.required, Validators.pattern(this.number_decimal_pattern)])],
        serviceDuration: ['', Validators.compose([Validators.required, Validators.pattern(this.number_pattern), Validators.maxLength(10)])],
        totalAmount: [0, Validators.compose([Validators.required, Validators.pattern(this.number_decimal_pattern), Validators.maxLength(10)])],
        isPrePayment: [{ 'value': false, 'disabled': this.base_licence }],
        taxable: [false],
        notification: [false]
      });
    }
  }

  setValue(data) {
    if (!this.isServiceBillable) {
      this.amForm.setValue({
        'name': data['name'] || this.amForm.get('name').value,
        'description': data['description'] || this.amForm.get('description').value,
        'department': data['department'] || this.amForm.get('department').value,
        'serviceDuration': data['serviceDuration'] || this.amForm.get('serviceDuration').value,
        /*'totalAmount': data['totalAmount'] || this.amForm.get('totalAmount').value,
        'isPrePayment': (!this.base_licence && data['minPrePaymentAmount'] &&
                                data['minPrePaymentAmount'] !== 0
                                ) ? true : false,
        'taxable': data['taxable'] || this.amForm.get('taxable').value,*/
        'notification': data['notification'] || this.amForm.get('notification').value,
      });
    } else {
      this.amForm.setValue({
        'name': data['name'] || this.amForm.get('name').value,
        'description': data['description'] || this.amForm.get('description').value,
        'department': data['department'] || this.amForm.get('department').value,
        'serviceDuration': data['serviceDuration'] || this.amForm.get('serviceDuration').value,
        'totalAmount': data['totalAmount'] || this.amForm.get('totalAmount').value || '0',
        'isPrePayment': (!this.base_licence && data['minPrePaymentAmount'] &&
          data['minPrePaymentAmount'] !== 0
        ) ? true : false,
        'taxable': data['taxable'] || this.amForm.get('taxable').value,
        'notification': data['notification'] || this.amForm.get('notification').value,
      });
    }
    this.changeNotification();
    this.changePrepayment();
  }

  onSubmit(form_data) {
    this.resetApiErrors();
    form_data.bType = 'Waitlist';
    if (!this.isServiceBillable) {
      form_data['totalAmount'] = 0;
      form_data['isPrePayment'] = false;
      form_data['taxable'] = false;
    } else {
      form_data.minPrePaymentAmount = (!form_data.isPrePayment || form_data.isPrePayment === false) ?
        0 : form_data.minPrePaymentAmount;
      form_data.isPrePayment = (!form_data.isPrePayment || form_data.isPrePayment === false) ? false : true;
    }
    if (this.data.type === 'add') {
      this.createService(form_data);
    } else if (this.data.type === 'edit') {
      form_data.id = this.service.id;
      this.updateService(form_data);
      // this.saveImages();
    }
  }

  createService(post_data) {
    this.disablebutton = true;
    this.savedisabled = true;
    this.api_loading = true;
    const holdstat = this.button_title;
    this.button_title = 'Please wait ...';
    this.provider_services.createService(post_data)
      .subscribe(
        data => {
          this.savedisabled = false;
          this.button_title = holdstat;
          const service_id = data;
          this.service = [];
          this.service['id'] = service_id;
          if (this.item_pic.files.length > 0) {
            this.saveImages('add');
          } else {
            // this.closePopup(this.shared_functions.getProjectMesssages('SERVICE_ADDED'));
            this.mode = 'afteradd';
          }
        },
        error => {
          this.api_error = this.shared_functions.getProjectErrorMesssages(error);
          this.savedisabled = false;
          this.api_loading = false;
          this.button_title = holdstat;
          this.disablebutton = false;
        }
      );
  }

  updateService(post_data) {
    this.disablebutton = true;
    this.provider_services.updateService(post_data)
      .subscribe(
        () => {
          if (this.item_pic.files.length > 0) {
            this.saveImages('edit');
          } else {
            this.closePopup(this.shared_functions.getProjectMesssages('SERVICE_UPDATED'));
          }
        },
        error => {
          this.api_error = this.shared_functions.getProjectErrorMesssages(error);
          this.api_loading = false;
          this.disablebutton = false;
        }
      );
  }

  changeNotification() {
    if (this.amForm.get('notification').value === false) {
      this.amForm.removeControl('notificationType');
    } else {
      const value = (this.data.type === 'edit' && (this.service['notificationType'] && (this.service['notificationType'] !== 'none'))) ?
        this.service['notificationType'] : 'email';
      this.amForm.addControl('notificationType',
        new FormControl(value));
    }
  }

  changePrepayment() {
    if (this.isServiceBillable) {
      if (this.amForm.get('isPrePayment').value === false) {
        this.amForm.removeControl('minPrePaymentAmount');
      } else {
        if (this.amForm.get('isPrePayment').value === true) {
          this.getPaymentSettings();
        }
        const value = (this.data.type === 'edit' && this.service['minPrePaymentAmount']) ?
          this.service['minPrePaymentAmount'] : '';
        this.amForm.addControl('minPrePaymentAmount',
          new FormControl(value, Validators.compose([Validators.required, Validators.pattern(this.number_decimal_pattern)])));
      }
    }
  }

  imageSelect(input) {
    this.success_error = null;
    this.error_list = [];
    if (input.files) {
      for (const file of input.files) {
        this.success_error = this.shared_functions.imageValidation(file);
        if (this.success_error === true) {
          this.item_pic.files.push(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            this.item_pic.base64.push(e.target['result']);
          };
          reader.readAsDataURL(file);
        } else {
          this.error_list.push(this.success_error);
          if (this.error_list[0].type) {
            this.error_msg = 'Selected image type not supported';
          } else if (this.error_list[0].size) {
            this.error_msg = 'Please upload images with size < 5mb';
          }
        }
      }
    }
  }

  saveImages(from) {
    const submit_data: FormData = new FormData();
    const propertiesDetob = {};
    let i = 0;
    for (const pic of this.item_pic.files) {

      submit_data.append('files', pic, pic['name']);
      const properties = {
        'caption': this.item_pic.caption[i] || ''
      };
      propertiesDetob[i] = properties;
      i++;
    }
    const propertiesDet = {
      'propertiesMap': propertiesDetob
    };

    const blobPropdata = new Blob([JSON.stringify(propertiesDet)], { type: 'application/json' });
    submit_data.append('properties', blobPropdata);

    this.uploadApi(submit_data, from);

  }
  getDepartments() {
    this.loading = false;
    this.provider_services.getDepartments()
      .subscribe(
        data => {
          this.deptObj = data;
          this.departments = this.deptObj.departments;
          this.filterDepart = this.deptObj.filterByDept;
          if (this.type === 'add') {
            this.amForm.get('department').setValue(this.departments[0].departmentId);
          }
          this.loading = false;
        },
        error => {
          this.loading = false;
          this.shared_functions.apiErrorAutoHide(this, error);
        }
      );
  }
  handleDeptSelction(id) {
    const deptId = id;
  }
  uploadApi(submit_data, from) {
    this.savedisabled = true;
    const holdstat = this.button_title;
    this.button_title = 'Uploading ...';
    this.canceldisabled = true;
    this.provider_services.uploadServiceGallery(this.service.id, submit_data)
      .subscribe(
        () => {
          this.savedisabled = false;
          this.canceldisabled = false;
          this.button_title = holdstat;
          this.getGalleryImages();
          this.resetVariables();
          if (from === 'add') {
            // this.closePopup(this.shared_functions.getProjectMesssages('SERVICE_ADDED'));
            this.mode = 'afteradd';
          } else if (from === 'edit') {
            this.closePopup(this.shared_functions.getProjectMesssages('SERVICE_UPDATED'));
          }
        },
        error => {
          this.savedisabled = false;
          this.canceldisabled = false;
          this.button_title = holdstat;
          this.api_error = this.shared_functions.getProjectErrorMesssages(error);
        }
      );

  }

  loadGalleryImages(all_images) {

    const imagesArray = [];
    let i = 0;
    for (const image of all_images) {

      // const img =  new Image(
      //               image.url,
      //               image.thumbUrl, // no thumb
      //               image.caption, // no description
      //               null
      //             );
      const img = new Image(i, {
        img: image.url,
        description: ''
      });
      i++;
      imagesArray.push(img);
    }

    this.images = observableOf(imagesArray).pipe(delay(300));
  }

  openImageModal(index) {
    this.imagePointer = index; // this.imagesArray.indexOf(image);
    this.openModalWindow = true;
  }

  onCloseImageModal() {
    this.openModalWindow = false;
    // this.openModalWindowObservable = false;
  }

  confirmDelete(file) {
    this.shared_functions.confirmGalleryImageDelete(this, file);
  }

  deleteImage(file) {
    this.provider_services.deleteServiceGalleryImage(this.service.id, file.keyName)
      .subscribe(
        () => {
          this.shared_functions.apiSuccessAutoHide(this, Messages.SERVICE_IMAGE_DELETED);
          this.getGalleryImages();
        },
        error => {
          this.shared_functions.apiErrorAutoHide(this, error);
        }
      );

  }

  deleteTempImage(i) {
    this.item_pic.files.splice(i, 1);
    this.item_pic.base64.splice(i, 1);
    this.item_pic.caption.splice(i, 1);
  }

  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
    this.error_msg = null;
    this.error_list = [];
  }

  resetVariables() {
    this.item_pic = {
      files: [],
      base64: [],
      caption: []
    };
    this.resetApiErrors();
    this.success_error = null;
  }

  closePopup(message) {
    this.api_success = message;
    setTimeout(() => {
      this.dialogRef.close('reloadlist');
    }, projectConstants.TIMEOUT_DELAY);
  }

  getPaymentSettings() {
    this.payment_loading = true;
    this.provider_services.getPaymentSettings()
      .subscribe(
        data => {
          this.payment_settings = data;
          this.payment_loading = false;
          if (!this.payment_settings.onlinePayment) {
            this.shared_functions.apiErrorAutoHide(this, Messages.SERVICE_PRE_PAY_ERROR);
            if (!this.isServiceBillable) {
              this.amForm.get('isPrePayment').setValue(false);
              this.changePrepayment();
            }
          }
        },
        () => {
          // this.shared_functions.apiErrorAutoHide(this, error);
          // this.amForm.get('isPrePayment').setValue(false);
        }
      );
  }
  gotoManageQueue() {
    this.dialogRef.close('reloadlist');
    this.router.navigate(['/provider/settings/waitlist-manager/queues']);
  }

  isNumeric(evt) {
    return this.shared_functions.isNumeric(evt);
  }

  getDomainSubdomainSettings() {
    this.api_loading1 = true;
    const user_data = this.shared_functions.getitemfromLocalStorage('ynw-user');
    const domain = user_data.sector || null;
    const sub_domain = user_data.subSector || null;
    this.provider_services.domainSubdomainSettings(domain, sub_domain)
      .subscribe(
        (data: any) => {
          if (data.serviceBillable === true) {
            this.isServiceBillable = true;
          } else {
            this.isServiceBillable = false;
          }
          this.getTaxpercentage();
          this.createForm();
          this.isloading = true;
          if (this.data.type === 'edit') {
            this.service = this.data.service;
            this.setValue(this.service);
            this.getGalleryImages();
            this.button_title = 'Update';
          }
          this.api_loading1 = false;
        },
        error => {
          this.api_loading1 = false;
        }
      );
  }
}
