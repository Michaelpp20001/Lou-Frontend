import { Component, OnInit } from '@angular/core';
import { WineService } from '../wine.service';
import { SearchService } from '../search.service';
import { AdminService } from '../admin.service';
import { HighlightPipe } from './../highlight.pipe'

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {

  constructor(
    public _wine: WineService, 
    public _search: SearchService,
    public _admin: AdminService
    ) { }

  wineToDelete: any

  ngOnInit() {
  }

  showDialog(wine){
    this.wineToDelete = wine;
    let modal_t  = document.getElementById('modal_2')
    modal_t.classList.remove('hhidden')
    modal_t.classList.add('sshow');
  }

  closeDialog() {
      let modal_t  = document.getElementById('modal_2')
      modal_t.classList.remove('sshow')
      modal_t.classList.add('hhidden');
  }

}
