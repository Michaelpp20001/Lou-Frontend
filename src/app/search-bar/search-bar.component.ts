import { Component } from '@angular/core';
import { SearchService } from '../search.service';
import { TabService } from '../tab.service'; 

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {

  constructor(
    public _search: SearchService,
    public _tab: TabService
    ) { }
}
