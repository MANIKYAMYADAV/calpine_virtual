import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedFunctions } from '../../functions/shared-functions';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { GroupStorageService } from '../../services/group-storage.service';
import { projectConstantsLocal } from '../../constants/project-constants';
import { ProviderSharedFuctions } from '../../../ynw_provider/shared/functions/provider-shared-functions';



@Component({
  selector: 'app-communication',
  templateUrl: './communication.component.html',
  styleUrls: ['./communication.component.css']
})
export class CommunicationComponent implements OnInit {

  orderDetails: any;
  loading: boolean;
  user_id: any;
  usertype: any;
  type: any;
  message: any;
  uid: any;
  ownerName = 'provider';
  newTimeDateFormat = projectConstantsLocal.DATE_MM_DD_YY_HH_MM_A_FORMAT;
  constructor(public dialogRef: MatDialogRef<CommunicationComponent>,
    private shared_functions: SharedFunctions,
    private providerServices: ProviderServices,
    private groupService: GroupStorageService,
    private provider_shared_functions: ProviderSharedFuctions,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.uid = this.data.id;
    this.message = this.data.message;
    console.log(JSON.stringify(this.message));
    this.type = this.data.type;
    this.orderDetails = this.data.orderDetails;
    this.message.sort(function (message1, message2) {
      if (message1.timeStamp < message2.timeStamp) {
        return -1;
      } else if (message1.timeStamp > message2.timeStamp) {
        return 1;
      } else {
        return 0;
      }
    });
    console.log(JSON.stringify(this.message));
    this.usertype = this.shared_functions.isBusinessOwner('returntyp');

    if (this.usertype === 'provider') {
      this.providerServices.getBussinessProfile()
        .subscribe(
          (data: any) => {
            this.user_id = data.id;
            this.loading = false;
          },
          () => {
            this.loading = false;
          }
        );
    } else {
      const userDet = this.groupService.getitemFromGroupStorage('ynw-user');
      this.user_id = userDet.id;
      this.loading = false;
    }

  }
  sendMessage() {


    let order = [];
    if (this.orderDetails.length > 1) {
      order = this.orderDetails;
    } else {
      order.push(this.orderDetails);
    }
    console.log(order);
    this.provider_shared_functions.addConsumerInboxMessage(order, this, 'order-provider')
      .then(
        () => { },
        () => { }
      );
      this.dialogRef.close();
  }

  splitMessageByColon(message) {
    let newmessage = message;
    if (message.includes(':')) {
      newmessage = message.split(':')[1];

    }
    return newmessage;

  }
}