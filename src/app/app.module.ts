import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';
import { TableComponent } from './table/table.component';
import { FormsModule } from '@angular/forms';
import { SearchPipe } from './search.pipe';
import { HomeComponent } from './home/home.component';
import { ChartsComponent } from './charts/charts.component';
import {  ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    TableComponent,
    SearchPipe,
    HomeComponent,
    ChartsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule

  ],
  providers: [],
 
  bootstrap: [AppComponent]
})
export class AppModule { }
