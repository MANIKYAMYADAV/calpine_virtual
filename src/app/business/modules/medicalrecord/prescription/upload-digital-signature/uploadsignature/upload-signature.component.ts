import { Component, OnInit, ViewChild } from '@angular/core';
import { projectConstants } from '../../../../../../app.component';
import { MedicalrecordService } from '../../../medicalrecord.service';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../../shared/functions/shared-functions';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { projectConstantsLocal } from '../../../../../../shared/constants/project-constants';
import { MatDialog } from '@angular/material/dialog';
import { SignaturePad } from 'angular2-signaturepad';

@Component({
  selector: 'app-upload-signature',
  templateUrl: './upload-signature.component.html'
})
export class UploadSignatureComponent implements OnInit {
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  signaturePadOptions: Object = {
    'minWidth': 5,
    'canvasWidth': 500,
    'canvasHeight': 300
  };
  display_PatientId: any;
  today = new Date();
  patientDetails;
  userId;
  drugtype;
  editedIndex;
  drugdet;
  mrId;
  selectedMessage = {
    files: [],
    base64: [],
    caption: []
  };
  temarry = {
    files: [],
    base64: [],
    caption: []
  };
  showSave = true;
  sharedialogRef;
  uploadImages: any =[] ;

  upload_status = 'Added to list';
  disable = false;
  heading = 'Upload digital signature';
  display_dateFormat = projectConstantsLocal.DISPLAY_DATE_FORMAT_NEW;
  navigationParams: any;
  navigationExtras: NavigationExtras;
  providerId;
  digitalSign = false;
  signatureviewdialogRef;
  digitalsignature = {};
  
  constructor(public sharedfunctionObj: SharedFunctions,
    public provider_services: ProviderServices,
    private router: Router,
    private activatedRoot: ActivatedRoute,
    public dialog: MatDialog,
    private medicalrecord_service: MedicalrecordService) {
    this.medicalrecord_service.patient_data.subscribe(res => {
      this.navigationParams = res;
      this.navigationExtras = this.navigationParams;
    });
    this.medicalrecord_service.patient_data.subscribe(data => {
      this.patientDetails = JSON.parse(data.customerDetail);
      if (this.patientDetails.memberJaldeeId) {
        this.display_PatientId = this.patientDetails.memberJaldeeId;
      } else if (this.patientDetails.jaldeeId) {
        this.display_PatientId = this.patientDetails.jaldeeId;
      }
      this.userId = this.patientDetails.id;
    });
    this.medicalrecord_service._mrUid.subscribe(mrId => {
      if (mrId !== 0) {
        this.mrId = mrId;
      }
    });
    this.activatedRoot.queryParams.subscribe(queryParams => {
      if (queryParams.providerId) {
        this.providerId = queryParams.providerId;
      }
    });

  }

  ngOnInit() {
  }

  goBack() {
    //this.router.navigate(['provider', 'customers', 'medicalrecord', 'prescription'], { queryParams: this.navigationParams });
  }

  filesSelected(event) {
    const input = event.target.files;
    if (input) {
      for (const file of input) {
       if (projectConstants.FILETYPES_UPLOAD.indexOf(file.type) === -1) {
          this.sharedfunctionObj.openSnackBar('Selected image type not supported', { 'panelClass': 'snackbarerror' });
        } else if (file.size > projectConstants.IMAGE_MAX_SIZE) {
          this.sharedfunctionObj.openSnackBar('Please upload images with size < 10mb', { 'panelClass': 'snackbarerror' });
        } else {
          this.selectedMessage.files.push(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            this.selectedMessage.base64.push(e.target['result']);
          };
          reader.readAsDataURL(file);
          this.showSave = true;
        }
      }
    }
  }
  imageSize(val) {
    let imgsize;
    imgsize = Math.round((val / 1024));
    return imgsize;
  }
  deleteTempImage(index) {
    this.selectedMessage.files.splice(index, 1);
  }


  saveDigitalSignImages() {
    const submit_data: FormData = new FormData();
    const propertiesDetob = {};
    let i = 0;
    for (const pic of this.selectedMessage.files) {
      console.log(pic);
      submit_data.append('files', pic, pic['name']);
      const properties = {
        'caption': this.selectedMessage.caption[i] || ''
      };
      propertiesDetob[i] = properties;
      i++;
    }
    const propertiesDet = {
      'propertiesMap': propertiesDetob
    };
    const blobPropdata = new Blob([JSON.stringify(propertiesDet)], { type: 'application/json' });
    submit_data.append('properties', blobPropdata);
    if (this.providerId) {
      this.uploadMrDigitalsign(this.providerId, submit_data);
    }
  }

  uploadMrDigitalsign(id, submit_data) {
    this.provider_services.uploadMrDigitalsign(id, submit_data)
      .subscribe((data) => {
        this.sharedfunctionObj.openSnackBar('Digital sign uploaded successfully');
        this.router.navigate(['provider', 'customers', 'medicalrecord', 'prescription'], { queryParams: this.navigationParams });
      },
        error => {
          this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
  }


}
