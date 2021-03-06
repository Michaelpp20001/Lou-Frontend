import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { WineService } from '../wine.service';

@Component({
  selector: 'app-deleted-wines',
  templateUrl: './deleted-wines.component.html',
  styleUrls: ['./deleted-wines.component.css']
})
export class DeletedWinesComponent implements OnInit {

  constructor(
    public _admin: AdminService,
    public _wine: WineService
  ) { }

  ngOnInit() {
  }

}
