import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { HttpClientModule } from '@angular/common/http'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ReactiveFormsModule } from '@angular/forms'
import { MatSelectModule } from '@angular/material/select'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { ConversionFormComponent } from './components/conversion-form/conversion-form.component'
import { ChartsModule } from 'ng2-charts'
import { DividePipe } from './pipes/divide.pipe'
import { CoinGeckoApiService } from './services/coin-gecko-api.service'
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CapitalizePipe } from './pipes/capitalize.pipe'

@NgModule({
  declarations: [
    AppComponent,
    ConversionFormComponent,
    DividePipe,
    CapitalizePipe
  ],
  imports: [
    MatAutocompleteModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    ChartsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  providers: [CoinGeckoApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
