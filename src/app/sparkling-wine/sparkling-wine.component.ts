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

  ngOnInit() {
  }

}
