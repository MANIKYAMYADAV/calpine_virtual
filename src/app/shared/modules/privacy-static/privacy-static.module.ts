import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/modules/common/shared.module';
import { HeaderModule } from '../../../shared/modules/header/header.module';

// import { SearchDataStorageService  } from '../../services/search-datastorage.services';

import { PrivacyStaticComponent } from './privacy-static.component';
// import { HttpCommonService } from '../../services/http-common.service';
@NgModule({
    imports: [
      SharedModule,
      HeaderModule
    ],
    declarations: [PrivacyStaticComponent],
    exports: [PrivacyStaticComponent],
    providers: []
})

export class PrivacyStaticModule {
}
