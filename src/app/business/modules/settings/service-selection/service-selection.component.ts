import { SelectionModel } from '@angular/cdk/collections';
import { Location } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../shared/constants/project-messages';
import { SelectionService } from '../../../../shared/services/selectionService';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';

@Component({
    selector: 'app-services-selection',
    templateUrl: './service-selection.component.html',
    styleUrls: ['./service-selection.component.css']
})
export class ServiceSelectionComponent implements OnInit, AfterViewInit {
    accountType: any;
    selected_data_id: number;
    serviceCount: any;
    all_queue_sel: boolean;
    all_schedule_sel: boolean;
    all_service_selected: boolean;
    queue_list: any = [];
    schedules_list: any = [];
    type: any;
    serviceList: any;
    selection_type: any;
    services_selected: any = [];
    services_list: any = [];
    service_cap = Messages.QUEUE_SERVICE_OFFERD_CAP;
    select_All = Messages.SELECT_ALL;
    public service_dataSource = new MatTableDataSource<any>();
    selected_data: any = [];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    service_loading$ = true;
    service_displayedColumns = ['select', 'serviceName', 'userName', 'status'];
    selection = new SelectionModel(true, []);
    constructor(private activated_route: ActivatedRoute,
        private location: Location,
        private provider_services: ProviderServices,
        public shared_functions: SharedFunctions,
        private selectionService: SelectionService,
        private snackbarService: SnackbarService,
        private groupService: GroupStorageService
    ) {
        console.log('loading');
        const user = this.groupService.getitemFromGroupStorage('ynw-user');
        this.accountType = user.accountType;
        if (this.accountType !== 'BRANCH') {
            this.service_displayedColumns = ['select', 'serviceName', 'status'];
        }
        const _this = this;
        _this.activated_route.queryParams.subscribe(qparams => {
            _this.type = qparams.type;
            _this.selected_data_id = qparams.data;
            if (_this.type === 'donation') {
                _this.service_displayedColumns = ['select', 'serviceName', 'status'];
            }
            const serviceData: any[] = qparams.data.split(',');
            for (let i = 0; i < serviceData.length; i++) {
                _this.selected_data.push(serviceData[i]);
            }
            _this.loadAllServices().then(result => {
                if (parseInt(qparams.data, 0) === 0) {
                    this.masterToggle();
                }
                if (_this.selected_data.length > 0) {
                    _this.service_dataSource.data.forEach(function (row) {
                        if (_this.selected_data && _this.selected_data.length > 0) {
                            _this.selected_data.forEach(data => {
                                // tslint:disable-next-line:radix
                                if (parseInt(data) === row.id) {
                                    _this.selection.select(row);
                                }
                            });
                        }
                    });
                }
            });
        });
    }
    goBack() {
        this.location.back();
    }
    applyFilter(filterValue: string) {
        this.selection.clear();
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.service_dataSource.filter = filterValue;
    }
    ngOnInit() {
    }
    ngAfterViewInit() {
        console.log('hereeeeeee');
        this.paginator._intl.itemsPerPageLabel = 'Services per page';
    }
    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.service_dataSource.data.length;
        return numSelected === numRows;
    }
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.service_dataSource.data.forEach(row => this.selection.select(row));
    }
    // service related method-------------------------------------------------------->
    setServiceDataSource(result) {
        const service_list: any = [];
        result.forEach(serviceObj => {
            let userName = '';
            if (serviceObj.provider) {
                userName = serviceObj.provider.firstName + ' ' + serviceObj.provider.lastName;
            }
            service_list.push(
                {
                    'id': serviceObj.id,
                    'name': serviceObj.name,
                    'user': userName,
                    'status': serviceObj.status
                });
        });
        return service_list;
    }
    loadAllServices() {
        let filter1 = {};
        if (this.type === 'payment') {
            filter1 = {};
        } else if (this.type === 'donation') {
            filter1 = { 'serviceType-eq': 'donationService' };
        } else {
            filter1 = { 'serviceType-neq': 'donationService' };
        }
        return new Promise<void>((resolve) => {
            this.provider_services.getServicesList(filter1)
                .subscribe(
                    (data: any) => {
                        this.service_dataSource.data = this.setServiceDataSource(data);
                        this.serviceCount = data.length;
                        this.service_loading$ = false;
                        resolve();
                    },
                    () => { }
                );
        });
    }
    getProviderName(service_obj) {
        if (service_obj.provider) {
            return service_obj.provider.firstName + ' ' + service_obj.provider.lastName;
        } else {
            return '';
        }
    }
    // common method got o previous page------------------------------------->
    getSelectedServices() {
        this.services_selected = this.selection.selected;
        if (this.selection.selected.length === 0) {
            this.snackbarService.openSnackBar('Please select atleast one', { 'panelClass': 'snackbarerror' });
        } else {
            if (this.service_dataSource.filteredData.length < this.selection.selected.length) {
                this.services_selected = this.service_dataSource.filteredData;
            } else if (this.service_dataSource.filteredData.length > this.selection.selected.length) {
                this.services_selected = this.selection.selected;
            }
            if (this.services_selected.length === this.serviceCount) {
                this.services_selected = 'All';
            }
            if (this.services_selected !== 'All') {
                let service_id = '';
                this.services_selected.forEach(function (service) {
                    service_id = service_id + service.id + ',';
                });
                this.services_selected = service_id;
            }
            console.log(this.services_selected);
            // if (this.queueDetail) {
            this.selectionService.serviceSelected(this.services_selected);
            this.location.back();
            // this.router.navigate(['provider', 'settings', 'q-manager', 'queues', 'add']);
            // } else {
            // this.report_data_service.updatedServiceDataSelection(this.services_selected);
            // this.router.navigate(['provider', 'reports', 'new-report'], { queryParams: { report_type: this.reportType } });
            // }
        }
    }
    //   redirecToReports() {
    //     this.router.navigate(['provider', 'reports', 'new-report'], { queryParams: { report_type: this.reportType } });
    //   }
}
