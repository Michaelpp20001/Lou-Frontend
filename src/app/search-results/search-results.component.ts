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

  ngOnInit() {
  }

}
