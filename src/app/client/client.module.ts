import { NgModule } from '@angular/core';
import { CoreModule } from '../common/core.module';
import { ClientComponent } from './components/client/client.component';
import { ClientService } from './services/client.service';

@NgModule({
  imports: [
    CoreModule,
  ],
  declarations: [
    ClientComponent
  ],
  providers: [ClientService],
  exports: [],
})
export class ClientModule { }
