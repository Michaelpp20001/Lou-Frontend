import { Component, OnInit } from '@angular/core';
import { WineService } from '../wine.service';
import { AdminService } from  '../admin.service';
import { TabService } from '../tab.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-wbg',
  templateUrl: './new-wbg.component.html',
  styleUrls: ['./new-wbg.component.css']
})
export class NewWbgComponent implements OnInit {

  ngOnInit() {
  }

  constructor(
    public _wine: WineService,
    public _admin: AdminService,
    public _tab: TabService,
    public router: Router
    ) { }

  async onFileSelected(event) {
    //Upload a new label image from file on PC and convert to base64, 
    //also save to session storage for later retrieval

    console.log(event);

    let file = event.target.files[0];
    let reader = new FileReader();
    sessionStorage.clear();
    reader.onload = () => {
      let convertedBase64Image = reader.result.toString();
      sessionStorage.setItem("base64Image", convertedBase64Image);
      this._wine.selectedFile.labelImage = sessionStorage.getItem("base64Image");
    };
    reader.readAsDataURL(file);
  }

  onUploadNewWine() {
    this._wine.uploadNewWine();
    this._tab.currentTab = 1;
  }

  cancel() {
    this._wine.selectedFile.labelImage = "";
    this._wine.newWine = {
        id: "",
        category: "",
        name: "",
        producer: "",
        grape: "",
        country: "",
        region: "",
        subRegion: "",
        apperance: "",
        nose: "",
        palate: "",
        abv: "",
        wineMakingNotes: "",
        foodPairings: "",
        notes: "",
        labelImage: "",
        keywords: [],
    }
    this.router.navigateByUrl('/wbgList');
    this._tab.currentTab = 1;
  }

}
