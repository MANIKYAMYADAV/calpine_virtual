import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { MatDialog } from '@angular/material';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { KeyValue } from '@angular/common';

@Component({
    'selector': 'app-video-settings',
    'templateUrl': './video-settings.component.html'
})
export class VideoSettingsComponent implements OnInit {
    api_loading: boolean;
    virtualCallModesList: any = [];
    skypeselected = false;
    whatsappselected = false;
    imoselected = false;
    botimselected = false;
    hangoutselected = false;
    jaldeeselected = false;
    skypeMode = '';
    whatsappMode = '';
    hangoutMode = '';
    botimMode = '';
    imoMode = '';
    jaldeeMode = '';

    videoModes = {
        SKYPE: { value: 'SKYPE', displayName: 'Skype', placeHolder: 'Skype ID', titleHelp: 'Configure Skype Settings', actualValue: '', enabled: false },
        WHATSAPP: { value: 'WHATSAPP', displayName: 'WhatsApp', placeHolder: 'WhatsApp ID', titleHelp: 'Configure WhatsApp Settings', actualValue: '', enabled: false },
        HANGOUTS: { value: 'HANGOUTS', displayName: 'Hangouts', placeHolder: 'Hangouts ID', titleHelp: 'Configure Hangouts Settings', actualValue: '', enabled: false },
        BOTIM: { value: 'BOTIM', displayName: 'BOTIM', placeHolder: 'BOTIM ID', titleHelp: 'Configure BOTIM Settings', actualValue: '', enabled: false },
        IMO: { value: 'IMO', displayName: 'IMO', placeHolder: 'IMO ID', titleHelp: 'Configure IMO Settings', actualValue: '', enabled: false }
    };
    breadcrumbs = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            title: 'Comm',
            url: '/provider/settings/comm'
        },
        {
            title: 'Video Call',
        }
    ];
    originalOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
        return 0;
    }
    constructor(private _formBuilder: FormBuilder,
        private router: Router,
        public shared_functions: SharedFunctions,
        private dialog: MatDialog,
        private sharedfunctionObj: SharedFunctions,
        private provider_services: ProviderServices) {
    }
    ngOnInit() {
        this.api_loading = true;
        this.getVirtualCallingModesList();
    }

    getVirtualCallingModesList() {
        this.provider_services.getVirtualCallingModes().subscribe(
            (data: any) => {
                this.virtualCallModesList = data.virtualCallingModes;
                this.virtualCallModesList.forEach(mode => {
                    console.log(mode);
                    this.videoModes[mode.callingMode].actualValue = mode.value;
                    if (mode.status && mode.status === 'ACTIVE') {
                        this.videoModes[mode.callingMode].enabled = true;
                    } else {
                        this.videoModes[mode.callingMode].enabled = false;
                    }
                });
                this.api_loading = false;
                console.log(this.virtualCallModesList);
            },
            (error: any) => {
                this.api_loading = false;
            });
    }
    // addVideocallMode() {
    // const virtualCallingModes = {
    //     'virtualCallingModes': [
    //         {
    //             'callingMode': 'SKYPE',
    //             'value': this.skypeMode,
    //         },
    //         {
    //             'callingMode': 'WHATSAPP',
    //             'value': this.whatsappMode,
    //         },
    //         {
    //             'callingMode': 'HANGOUTS',
    //             'value': this.hangoutMode,
    //         },
    //         {
    //             'callingMode': 'BOTIM',
    //             'value': this.botimMode,
    //         },
    //         {
    //             'callingMode': 'IMO',
    //             'value': this.imoMode,
    //         }
    //   ,
    //   {
    //     'callingMode': 'JALDEE_INTEGRATED_VIDEO',
    //     'value': this.jaldeeMode,
    //   },
    //     ]
    // };
    // }
    updateVideoSettings(resultMode, callingMode) {
        const virtualCallingModes = [];
        console.log(resultMode);
        console.log(callingMode);
        this.virtualCallModesList.forEach(modes => {
            if (modes.callingMode === callingMode) {
                let status = 'INACTIVE';
                if (resultMode.value.enabled) {
                    status = 'ACTIVE';
                }
                const mode = {
                    'callingMode': callingMode,
                    'value': resultMode['value'].actualValue,
                    'status': status
                };
                virtualCallingModes.push(mode);
            } else {
                virtualCallingModes.push(modes);
            }
        });

        this.provider_services.addVirtualCallingModes(virtualCallingModes).subscribe(
            (data) => {
                this.shared_functions.openSnackBar('Virtual calling modes added successfully', { 'panelclass': 'snackbarerror' });
                this.getVirtualCallingModesList();
            },
            error => {
                this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            }
        );
    }
    // skypeSelected(event) {
    //     this.skypeselected = event.checked;
    // }
    // whatsappSelected(event) {
    //     this.whatsappselected = event.checked;
    // }
    // hangoutSelected(event) {
    //     this.hangoutselected = event.checked;
    // }
    // botimSelected(event) {
    //     this.botimselected = event.checked;
    // }
    // imoSelected(event) {
    //     this.imoselected = event.checked;
    // }
    // jaldeeSelected(event) {
    //     this.jaldeeselected = event.checked;
    // }
}
