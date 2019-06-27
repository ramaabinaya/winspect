import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Injectable, NgZone, EventEmitter } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

// import * as store from 'store'

const MINUTES_UNITL_AUTO_LOGOUT = 30; // in Minutes
const CHECK_INTERVALL = 1000; // in ms
const STORE_KEY = 'lastAction';
const MINUTES_UNITL_DIALOG_AUTO_LOGOUT = 2;

@Injectable()
export class AutoLogoutService {
    dialogclose = new EventEmitter<any>();
    constructor(
        private auth: AuthService,
        private router: Router,
        private ngZone: NgZone,
        private confirmationService: ConfirmationService
    ) {
        this.check();
        this.initListener();
        this.initInterval();
    }
    get lastAction() {
        // return parseInt(store.get(STORE_KEY), 10);
        return parseInt(localStorage.getItem(STORE_KEY), 10);
    }
    set lastAction(value) {
        // store.set(STORE_KEY, value);
        localStorage.setItem(STORE_KEY, Date.now().toString());
    }

    initListener() {
        this.ngZone.runOutsideAngular(() => {
            document.body.addEventListener('click', () => this.reset());
            document.body.addEventListener('mouseover', () => this.reset());
            document.body.addEventListener('mouseout', () => this.reset());
            document.body.addEventListener('keydown', () => this.reset());
            document.body.addEventListener('keyup', () => this.reset());
            document.body.addEventListener('keypress', () => this.reset());
            document.body.addEventListener('wheel', () => this.reset());
        });
    }

    initInterval() {
        this.ngZone.runOutsideAngular(() => {
            setInterval(() => {
                this.check();
            }, CHECK_INTERVALL);
        });
    }

    reset() {
        this.lastAction = Date.now();
    }

    check() {
        this.ngZone.runOutsideAngular(() => {
            const hideScroll = document.body.classList.contains('modal-open');
            // if (hideScroll === true) {
            //     console.log('before: ', document.getElementById('report'));
            //     document.getElementById('report').classList.remove('scroll-content');
            //     console.log('after: ', document.getElementById('report'));
            // }
            // if (hideScroll === false && document.getElementById('report')) {
            //     console.log('hidescroll false');
            //     console.log('before1: ', document.getElementById('report'));
            //     if (!document.getElementById('report').classList.contains('scroll-content')) {
            //     const scrollContent = document.getElementById('report').classList.add('scroll-content');
            //     console.log('hidescroll false1: ', scrollContent);
            //     }
            // }
        });
        const now = Date.now();
        const timeleft = this.lastAction + MINUTES_UNITL_AUTO_LOGOUT * 60 * 1000;
        const diff = timeleft - now;
        const isTimeout = diff < 0;

        this.ngZone.run(() => {
            if (isTimeout && this.auth.isAuthenticated()) {
                const dialogOpen = Date.now();
                const dialogtimeleft = this.lastAction + MINUTES_UNITL_DIALOG_AUTO_LOGOUT * 60 * 1000;
                const diffence = dialogtimeleft - dialogOpen;
                const isDialogTimeout = diffence < 0;
                this.confirmationService.confirm({
                    message: 'Your session is about to expire. Do you want to continue?',
                    header: 'Confirmation',
                    accept: () => {
                        this.reset();
                    },
                    reject: () => {
                        console.log(`Sie wurden automatisch nach ${MINUTES_UNITL_AUTO_LOGOUT} Minuten Inaktivität ausgeloggt.`);
                        this.auth.logout();
                        this.router.navigate(['signin']);

                    }
                });
                if (isDialogTimeout) {
                    this.dialogclose.emit('close');
                    this.auth.logout();
                    this.router.navigate(['signin']);

                }
            }
        });
    }
}
