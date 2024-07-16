import { Component } from '@angular/core';
import { EventEmitter, Input, Output } from '@angular/core';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  @Input()SearchC:any="";
  @Input()id:any
  @Input()name:any
  @Input()status:any
  @Input()species:any
  @Input()gender:any

  // getsearch(d:any){
  //   this.SearchC=d.target.value;

  // }
  @Output()
  emitRadio: EventEmitter<string> = new EventEmitter();

  onSelect() {
    this.emitRadio.emit(this.SearchC);
  }
 
}
