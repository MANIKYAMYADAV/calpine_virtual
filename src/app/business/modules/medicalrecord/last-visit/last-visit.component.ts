import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { NavigationExtras, Router } from '@angular/router';
import { DateFormatPipe } from '../../../../shared//pipes/date-format/date-format.pipe';
import { MedicalrecordService } from '../medicalrecord.service';

@Component({
  selector: 'app-last-visit',
  templateUrl: './last-visit.component.html',
  styleUrls: ['./last-visit.component.css']
})
export class LastVisitComponent implements OnInit {
  PatientId: any;
  public lastVisit_dataSource = new MatTableDataSource<any>();
  lastVisit_displayedColumns = ['consultationDate', 'serviceName', 'userName', 'mr', 'rx'];
  providerid: any;
  accountType: any;
  visitdetails: string;
  customerDetails: any;
  loading = true;
  visitcount: any;
  back_type: any;
  constructor(public provider_services: ProviderServices,
    public sharedfunctionObj: SharedFunctions,
    private router: Router,
    public dateformat: DateFormatPipe,
    private medicalrecordService: MedicalrecordService,
    public dialogRef: MatDialogRef<LastVisitComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.PatientId = this.data.patientId;
    if (this.data.back_type) {
      this.back_type = this.data.back_type;
      console.log(this.back_type);
    }
    if (this.data.customerDetail) {
      this.customerDetails = this.data.customerDetail;
    }
    const user = this.sharedfunctionObj.getitemFromGroupStorage('ynw-user');
    this.accountType = user.accountType;
    if (this.accountType !== 'BRANCH') {
      this.lastVisit_displayedColumns = ['consultationDate', 'serviceName', 'mr', 'rx'];
    }
    // tslint:disable-next-line: no-shadowed-variable
    this.medicalrecordService.patient_data.subscribe(data => {
      this.customerDetails = JSON.parse(data.customerDetail);
    });
  }

  ngOnInit() {
    this.getPatientVisitList();
    this.getPatientVisitListCount();
    // this.getproviderVisitList();
  }
  getPatientVisitListCount() {
    this.provider_services.getPatientVisitListCount(this.PatientId)
    .subscribe((data: any) => {
      this.visitcount = data;
      console.log(this.visitcount);
    },
      error => {
        this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
      });
  }
  getPatientVisitList() {
    this.provider_services.getPatientVisitList(this.PatientId)
      .subscribe((data: any) => {
        this.lastVisit_dataSource = data;
        this.loading = false;
      },
        error => {
          this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
  }
  getLastVisitTime(visit) {
    let time = '';
    if (visit.waitlist) {
      time = '';
    } else if (visit.appointmnet) {
      time = visit.appointmnet.apptStartTime;
    }
    return time;
  }
  // getLastVisitDate(visit) {
  //   let date = '';
  //   if (visit.waitlist) {
  //     date = visit.waitlist.date;
  //   } else if (visit.appointmnet) {
  //     date = visit.appointmnet.appmtDate;
  //   }
  //   return  this.dateformat.transformToDIsplayFormat(date);
  // }
  getLastVisitDate(visit) {
    return  this.dateformat.transformToDIsplayFormat(visit.lastVisitedDate);
  }
  isMRCreated(visit) {
    let mrCreated = '';
    if (visit.waitlist) {
      mrCreated = visit.mrCreated;
    } else if (visit.appointmnet) {
      mrCreated = visit.mrCreated;
    }
    return mrCreated;

  }
  isRxCreated(visit) {
    let rxCreated = '';
    if (visit.waitlist) {
      rxCreated = visit.waitlist.prescriptionCreated;
    } else if (visit.appointmnet) {
      rxCreated = visit.appointmnet.prescriptionCreated;
    }
    return rxCreated;

  }
  getServiceName(visit) {
    let serviceName = '';
    if (visit.waitlist) {
      serviceName = visit.waitlist.service.name;
    } else if (visit.appointmnet) {
      serviceName = visit.appointmnet.service.name;
    }
    return serviceName;

  }
  viewMedicalRecord(visitDetails) {
    if (visitDetails.waitlist) {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          'customerDetail': JSON.stringify(visitDetails.waitlist.consumer),
          'serviceId': visitDetails.waitlist.service.id,
          'serviceName': visitDetails.waitlist.service.name,
          'booking_type': 'TOKEN',
          'booking_date': visitDetails.waitlist.date,
          'booking_time': visitDetails.waitlist.checkInTime,
          'department': visitDetails.waitlist.service.deptName,
          'consultationMode': 'OP',
          'booking_id': visitDetails.waitlist.ynwUuid,
          'mrId': visitDetails.mrId,
          'visitDate': visitDetails.lastVisitedDate,
          'back_type': this.back_type
        }
      };
      const result = {
        'navigationParams': navigationExtras,
        'type': 'clinicalnotes'
      };
      this.dialogRef.close(result);
      this.router.navigate(['provider', 'customers', 'medicalrecord', 'clinicalnotes'] , navigationExtras);
    } else {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          'customerDetail': JSON.stringify(visitDetails.appointmnet.providerConsumer),
          'serviceId': visitDetails.appointmnet.service.id,
          'serviceName': visitDetails.appointmnet.service.name,
          'department': visitDetails.appointmnet.service.deptName,
          'booking_type': 'APPT',
          'booking_date': visitDetails.appointmnet.appmtDate,
          'booking_time': visitDetails.appointmnet.apptTakenTime,
          'mrId': visitDetails.mrId,
          'booking_id': visitDetails.appointmnet.uid,
          'visitDate': visitDetails.lastVisitedDate,
          'back_type': this.back_type
        }
      };
      const result = {
        'navigationParams': navigationExtras,
        'type': 'clinicalnotes'
      };
      this.dialogRef.close(result);
      this.router.navigate(['provider', 'customers', 'medicalrecord', 'clinicalnotes'] , navigationExtras);
    }
  }

  viewMR_prescription(visitDetails) {
    if (visitDetails.waitlist) {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          'customerDetail': JSON.stringify(visitDetails.waitlist.consumer),
          'serviceId': visitDetails.waitlist.service.id,
          'serviceName': visitDetails.waitlist.service.name,
          'booking_type': 'TOKEN',
          'booking_date': visitDetails.waitlist.date,
          'booking_time': visitDetails.waitlist.checkInTime,
          'department': visitDetails.waitlist.service.deptName,
          'consultationMode': 'OP',
          'booking_id': visitDetails.waitlist.ynwUuid,
          'mrId': visitDetails.mrId,
          'visitDate': visitDetails.lastVisitedDate,
          'back_type': this.back_type
        }
      };
      const result = {
        'navigationParams': navigationExtras,
        'type': 'prescription'
      };
      this.dialogRef.close(result);
      this.router.navigate(['provider', 'customers', 'medicalrecord', 'prescription'], navigationExtras);
    } else {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          'customerDetail': JSON.stringify(visitDetails.appointmnet.providerConsumer),
          'serviceId': visitDetails.appointmnet.service.id,
          'serviceName': visitDetails.appointmnet.service.name,
          'department': visitDetails.appointmnet.service.deptName,
          'booking_type': 'APPT',
          'booking_date': visitDetails.appointmnet.appmtDate,
          'booking_time': visitDetails.appointmnet.apptTakenTime,
          'mrId': visitDetails.mrId,
          'booking_id': visitDetails.appointmnet.uid,
          'visitDate': visitDetails.lastVisitedDate,
          'back_type': this.back_type
        }
      };
      const result = {
        'navigationParams': navigationExtras,
        'type': 'prescription'
      };
      this.dialogRef.close(result);
      this.router.navigate(['provider', 'customers', 'medicalrecord', 'prescription'], navigationExtras);
    }

  }
}