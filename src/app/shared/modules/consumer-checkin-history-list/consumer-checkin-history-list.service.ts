import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
// Import RxJs required methods
import { ServiceMeta } from '../../../shared/services/service-meta';

@Injectable()
export class CheckInHistoryServices {

  constructor(private servicemeta: ServiceMeta, private http: HttpClient) {}

  getWaitlistHistory(params = {}) {
    return this.servicemeta.httpGet('consumer/waitlist/history', null, params);
    // set no_redirect_path in interceptor to avoid redirect on 401
  }

  getHistoryWaitlistCount(params= {}) {
    return this.servicemeta.httpGet('consumer/waitlist/history/count', null, params);
  }

  getWaitlistBill(params, uuid) {
    console.log(uuid);
    const path = 'consumer/bill/' + uuid;
    return this.servicemeta.httpGet(path, null, params);
  }

  getPaymentDetail(params, uuid) {
    const url = 'consumer/payment/details/' + uuid ;
    return this.servicemeta.httpGet(url, null, params);
  }

}
