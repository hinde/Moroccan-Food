import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrincipalRoutingModule } from './principal-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { MenuComponent } from './pages/menu/menu.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {PanelMenuModule} from 'primeng/panelmenu';
import {SplitterModule} from 'primeng/splitter';
import {ButtonModule} from 'primeng/button';
import { RecetasComponent } from './pages/recetas/recetas.component';
import {MenubarModule} from 'primeng/menubar';
import {PanelModule} from 'primeng/panel';
import {CarouselModule} from 'primeng/carousel';
import {InputTextModule} from 'primeng/inputtext';
import {AccordionModule} from 'primeng/accordion';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {ToastModule} from 'primeng/toast';
import {TableModule} from 'primeng/table';
import { MenudiarioComponent } from './pages/menudiario/menudiario.component';
import { MenusemanalComponent } from './pages/menusemanal/menusemanal.component';
import { CrearecetaComponent } from './pages/creareceta/creareceta.component';
import { AniadiramigosComponent } from './pages/aniadiramigos/aniadiramigos.component';
import { MostraramigosComponent } from './pages/mostraramigos/mostraramigos.component';
import {FocusTrapModule} from 'primeng/focustrap';
import {DropdownModule} from 'primeng/dropdown';
import {InputNumberModule} from 'primeng/inputnumber';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {FileUploadModule} from 'primeng/fileupload';
import {FieldsetModule} from 'primeng/fieldset';



@NgModule({
  declarations: [
    HomeComponent,
    MenuComponent,
    PerfilComponent,
    RecetasComponent,
    MenudiarioComponent,
    MenusemanalComponent,
    CrearecetaComponent,
    AniadiramigosComponent,
    MostraramigosComponent
  ],
  imports: [
    CommonModule,
    //BrowserModule,
    PrincipalRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PanelMenuModule,
    SplitterModule,
    ButtonModule,
    MenubarModule,
    PanelModule,
    CarouselModule,
    InputTextModule,
    AccordionModule,
    MessagesModule,
    MessageModule,
    ToastModule,
    TableModule,
    FocusTrapModule,
    DropdownModule,
    InputNumberModule,
    InputTextareaModule,
    FileUploadModule,
    FieldsetModule
  ]
})
export class PrincipalModule { }
