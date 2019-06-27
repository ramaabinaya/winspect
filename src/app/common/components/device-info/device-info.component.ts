// Device Info Component which is used to store device information and display the stored list.
import { Component, OnInit, OnDestroy } from '@angular/core';
import { GroupService } from '../../services/group.service';
import { AuthService } from '../../../auth/services/auth.service';
import { MatomoService } from '../../../common/services/matomo.service';

/**
 * Component which is used to display the devices information list.
 */
@Component({
    selector: 'app-device-info',
    templateUrl: './device-info.component.html',
    styleUrls: ['./device-info.component.css']
})
export class DeviceInfoComponent implements OnInit, OnDestroy {
    /**
     * Variable which is used to store all device information.
     */
    devices = [];
    /**
     * Variable which is used to subscribe or unsubscribe the device information from the database.
     * @type {Subscription}
     */
    subscriptionObject = {};
    /**
     * Variable which is used to display the message like error, success etc.,
     */
    messages: any;
    /**
     * Variable which is used to set the title of the page in metric tool.
     */
    pageTitle = 'DEVICES';
    /**
     * Component Constructor which is used to inject the required services.
     * @param groupService To get the device information from the database.
     * @param authService To get current user details.
     * @param matomoService to perform metric operation on this component.
     */
    constructor(private groupService: GroupService,
        private authService: AuthService,
        private matomoService: MatomoService) { }
    /**
     * Component OnInit life cycle hook.
     */
    ngOnInit() {
        this.matomoService.initialize(this.pageTitle);    // Setting the component as page to track.
        this.subscriptionObject['deviceInfo'] = this.groupService.getDeviceInfo().subscribe((res) => {
            if (res && res['devices']) {
                this.devices = res['devices'] ? res['devices'] : [];
            }
        }, (err) => {
            if (err.error && err.error.error) {
                console.log('Error: ', err.error.error);
            }
        });
        this.messages = this.authService.errorMessages;
    }
    /**
     * Method which is used to remove the device from the database.
     * @param index Which is used to define list index value.
     * @param deviceId Which is define the deviceId.
     */
    onRemoveDevice(index: number, deviceId: number) {
        this.subscriptionObject['removeDevice'] = this.groupService.removeDevice(deviceId).subscribe((res) => {
            if (res && res['devices']) {
                this.devices.splice(index, 1);
            }
        }, (err) => {
            if (err.error && err.error.error) {
                console.log('Error: ', err.error.error);
            }
        });
    }
    /**
     * Component OnDestroy life cycle hook
     */
    ngOnDestroy() {
        if (this.subscriptionObject) {
            for (const subscriptionProperty in this.subscriptionObject) {
                if (this.subscriptionObject[subscriptionProperty]) {
                    this.subscriptionObject[subscriptionProperty].unsubscribe();
                }
            }
        }
    }
}
