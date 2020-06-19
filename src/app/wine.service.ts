import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AdminService } from './admin.service';
import { TabService } from './tab.service';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WineService {

  constructor(
    public http: HttpClient, 
    public router: Router,
    public _admin: AdminService,
    public _tab: TabService
    ) { }

  baseUrl: string = "https://stark-shelf-74007.herokuapp.com/wbgs";
  deleteWineUrl: string = "https://stark-shelf-74007.herokuapp.com/deletedwbgs";
  selectedFile: any = {
    labelImage: "",
  };
  httpUploadError: any;
  httpUpdateError: any;
  loader: boolean = false;
  allWbg: any;
  wineToDeleteIndefinately: any;
  previousWines: any = [];
  sparklingWine: any = [];
  whiteWine: any = [];
  redWine: any = [];
  keywords: any = [];
  filterWords: any = ["the", "a", "an", "and", ",", ":", ";"];
  newWine = {
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
  };

  handleError(error) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      sessionStorage.setItem('httpError', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
        console.log("error", error.error.error.name)
        sessionStorage.setItem('httpError', `Error ${error.error.error.statusCode} occcurred from server with ${error.error.error.name}`)
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };


  filterKeywords(arr) {
    this.keywords = arr.filter(word => !this.filterWords.includes(word))
  }

  stringToArray(str) {
    return str.replace(/([,.])/g,"").trim().split(" ");
  }

  uploadNewWine() {
    this.loader = true;
    //If this wine was a previously deleted wine, delete it from the backend now
    if(this.wineToDeleteIndefinately) {
      this.deleteIndefinitely(this.wineToDeleteIndefinately);
    }
    this.winePreLoad();
    delete this.newWine.id
    delete this.httpUploadError
    this.http.post(this.baseUrl, this.newWine)
    .pipe(catchError(this.handleError))
    .subscribe(response => {

      console.log("New Wine", response);

      sessionStorage.clear();
      this.clearWbgInputs();
      this.getAllWbg();
      this.router.navigateByUrl('/wbgList')
      this.loader = false;
      this._tab.currentTab = 1;
    }, error => {
      this.httpUploadError = sessionStorage.getItem('httpError')
      this.loader = false;
    });
  }

  getAllWbg() {
    //get all Wbg and store to all Wbg variable/update arrays
    this.http.get(this.baseUrl)
    .subscribe(response => {

      console.log("All WBG", response);

      this.allWbg = response;
      for (let i = 0; i < this.allWbg.length; i++) {
        if (this.allWbg[i].category === "sparkling") {
          this.sparklingWine.push(this.allWbg[i]);
        } else if (this.allWbg[i].category === "red") {
          this.redWine.push(this.allWbg[i]);
        } else {
          this.whiteWine.push(this.allWbg[i]);
        }
      };
    });
  }

  getPreviousWines() {
    //get all Wbg and store to all Wbg variable/update arrays
    this.loader = true;
    this.http.get(this.deleteWineUrl)
    .subscribe(response => {

      console.log("All Previous WBG", response);

      this.previousWines = response;
      this.loader = false;
    });
  }

  winePreLoad() {
    //retrieving label image base64 from session storage and 
    //setting to new wine label image for upload
    let wine = this.newWine;
    wine.labelImage = sessionStorage.getItem("base64Image");
    //taking all inputs from new wbg/upadate wine component and creating a keywords array
    this.keywords = `${this.keywords} ${wine.category} ${wine.name} ${wine.producer} ${wine.grape} ${wine.country} ${wine.region} ${wine.subRegion} ${wine.apperance} ${wine.nose} ${wine.palate} ${wine.abv} ${wine.wineMakingNotes} ${wine.foodPairings} ${wine.notes}`.toLowerCase()
    this.newWine.keywords = this.stringToArray(this.keywords)

    console.log("filtered keywords array", this.newWine.keywords)

  }

  selectWine(wine) {

    console.log("Selected wine for update", wine)

    this.newWine = wine
    this.router.navigateByUrl('/updateWbg');
  }

  addBackToList(wine) {
    this.newWine = wine;
    this.wineToDeleteIndefinately = wine;
    this.router.navigateByUrl('/newWBG');
  }

  updateWine() {
    this.loader = true;
    this.winePreLoad();
    delete this.httpUpdateError;
    this.http.put(this.baseUrl + "/" + this.newWine.id, this.newWine)
    .pipe(catchError(this.handleError))
    .subscribe(update => {
      console.log("Update Success!");
      sessionStorage.clear();
      this.clearWbgInputs();
      this.getAllWbg();
      this.router.navigateByUrl('/wbgList')
      this._tab.currentTab = 1;
      this.loader = false;
    }, error => {
      this.httpUpdateError = sessionStorage.getItem('httpError');
      this.loader = false;

    });
  }

  deleteWine(wine) {
    this.loader = true;
    console.log(wine);

    this.http.delete(this.baseUrl + "/" + wine.id, wine)
    .subscribe(response => {
      console.log("Successfully deleted off WBG list")
      this.getAllWbg();
    })
    delete wine.id;
     
    console.log(wine);
    
    this.http.post(this.deleteWineUrl, wine)
    .subscribe(response => {

      console.log("Wine now in previous wines", response);

      sessionStorage.clear();
      this.clearWbgInputs();
      this.getPreviousWines();
      this.loader = false;
    });
    this.router.navigateByUrl('/previousWines');
    this._tab.currentTab = 0;
  }

  deleteIndefinitely(wine) {
    this.loader = true;
    console.log(wine);
    this.http.delete(this.deleteWineUrl + "/" + wine.id, wine)
    .subscribe(response => {
      console.log("Successfully deleted forever")
      this.loader = false;
      this.getPreviousWines();
    });
  }

  clearWbgInputs() {
    this.keywords = [];
    this.sparklingWine = [];
    this.whiteWine = [];
    this.redWine = [];
    this.selectedFile.labelImage = "";
    this.newWine = {
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
  };
  }
}
