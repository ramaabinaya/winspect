import { NgModule } from '@angular/core';
import { Camera } from '@ionic-native/camera';
import { CameraComponent } from './componenets/camera/camera.component';
import { CanvasWhiteboardModule } from 'ng2-canvas-whiteboard';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { SafePipe } from './pipes/safe.pipe';
import { KeyUpListenerDirective } from './directives/keyUpListener.directive';
import { SketchComponent } from './componenets/sketch/sketch.component';
import { SharedModule } from '../shared/shared.module';
// import { Routes, RouterModule } from '@angular/router';
// const mobile_routes: Routes = [
//   {
//     path: '', component: SketchComponent, children: [
//       { path: 'sketch', component: SketchComponent }
//     ]
//   }
// ];
@NgModule({
  declarations: [
    CameraComponent,
    SafePipe,
    KeyUpListenerDirective,
    SketchComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    CanvasWhiteboardModule,
    SharedModule
    // [RouterModule.forChild(mobile_routes)]
  ],
  providers: [
    Camera
  ],
  exports: [CameraComponent, SafePipe, KeyUpListenerDirective,
    // RouterModule
  ],
  entryComponents: []
})
export class MobileModule { }
