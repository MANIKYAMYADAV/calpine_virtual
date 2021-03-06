import { Component, OnInit, Inject } from '@angular/core';
import { SharedFunctions } from '../../functions/shared-functions';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DateTimeProcessor } from '../../services/datetime-processor.service';


@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.css']
})
export class CouponsComponent implements OnInit{
  couponsList: any = [];
  // type=false;
  tempCouponList: any = [];
  providerCouponList: any=[];
  ownCoupons: any = [] ;

  constructor(private shared_functions: SharedFunctions,
    private dateTimeProcessor: DateTimeProcessor,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }
  ngOnInit() {
    if (this.data.couponsList.JC) {
      this.tempCouponList = this.data.couponsList.JC;
    }
    if (this.data.couponsList.OWN) {
      this.ownCoupons = this.data.couponsList.OWN;
    }
    // if (this.data.type) {
    //   this.type = this.data.type;
    // }
    this.showCoupons();
  }


  showCoupons() {
    this.couponsList = [];
    this.providerCouponList = [];

      for (let index = 0; index < this.tempCouponList.length; index++) {
        this.couponsList.push(this.tempCouponList[index]);
        console.log(this.couponsList)

        // if (this.type) {
        //   if (this.tempCouponList[index].firstCheckinOnly === true) {
        //     this.couponsList.push(this.tempCouponList[index]);
        //   }
        // } else {
        //   if (this.tempCouponList[index].firstCheckinOnly === false) {
        //     this.couponsList.push(this.tempCouponList[index]);
        //   }
        // }
      }
    

    for (let index = 0; index < this.ownCoupons.length; index++) {
      this.providerCouponList.push(this.ownCoupons[index]);
      console.log(this.providerCouponList)

      // if (this.type) {
      //   if (this.ownCoupons[index].couponRules.firstCheckinOnly === true) {
      //     this.providerCouponList.push(this.ownCoupons[index]);
      //   }
      // } else {
      //   if (this.ownCoupons[index].couponRules.firstCheckinOnly === false) {
      //     this.providerCouponList.push(this.ownCoupons[index]);
      //     console.log(this.providerCouponList);
      //   }
      // }
    
  }
  
  }

  formatDateDisplay(dateStr) {
    return this.dateTimeProcessor.formatDateDisplay(dateStr);
  }

  toggle_adwordshowmore(type,i) {
    if(type==='jc'){
    if (this.couponsList[i].adwordshowmore) {
      this.couponsList[i].adwordshowmore = false;
    } else {
      this.couponsList[i].adwordshowmore = true;
    }
  }else if(type==='provider'){
    if (this.providerCouponList[i].adwordshowmore) {
      this.providerCouponList[i].adwordshowmore = false;
    } else {
      this.providerCouponList[i].adwordshowmore = true;
    }
  }
}
  formatPrice(price) {
    return this.shared_functions.print_PricewithCurrency(price);
  }
  copyText(baseid, baseidtooltip, mainid) {
    var range = document.createRange();
    range.selectNode(document.getElementById(baseid+mainid));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();

    var tooltip = document.getElementById(baseidtooltip+mainid);
    tooltip.innerHTML = "Copied to Clipboard";
    tooltip.classList.add("copied-text");
  }
  resetTooltip(basetooltipid, mainid) {
    var tooltip = document.getElementById(basetooltipid+mainid);
    tooltip.innerHTML = "Copy";
    tooltip.classList.remove("copied-text");
  }
}
