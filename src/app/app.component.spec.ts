import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { StatusBar } from '@ionic-native/status-bar';
import { HeaderService } from './common/services/header.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { OfflineStorageService } from './common/services/offlineStorage.service';
import { Network } from '@ionic-native/network';

class MockHeaderService{
  setHeaders() {
    return Observable.of({})
  }
}
class MockNetwork {
  onDisconnect() { 
    return Observable.of({});
}
onConnect() {
  return Observable.of({});

}
}

class MockOfflineStorageService {
  createDatabase() {}
  networkDisconnected = new BehaviorSubject<boolean>(false);
}
describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [ StatusBar,
      { provide: HeaderService, useClass: MockHeaderService },
      { provide: OfflineStorageService, useClass: MockOfflineStorageService },
      { provide: Network, useClass: MockNetwork }
     ]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  // it(`should have as title 'app'`, async(() => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.debugElement.componentInstance;
  //   expect(app.title).toEqual('app');
  // }));
  // it('should render title in a h1 tag', async(() => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('h1').textContent).toContain('Welcome to app!');
  // }));
});
