import { Component, OnInit } from '@angular/core';
import { WineService } from '../wine.service';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-sparkling-wine',
  templateUrl: './sparkling-wine.component.html',
  styleUrls: ['./sparkling-wine.component.css']
})
export class SparklingWineComponent implements OnInit {

  constructor(
    public _wine: WineService,
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
