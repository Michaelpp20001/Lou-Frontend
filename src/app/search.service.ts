import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { WineService } from './wine.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(public _wine: WineService, public http: HttpClient, public router: Router) { }

  searchInput: any;
  searchTerm: any;
  PositiveSearchTerm: any;
  htmlPositiveSearchTerm: any;
  PositiveSearchResult: boolean = false;
  NegativeSearchTerm: any;
  searchResults: any = [];
  noSearchResults: string = "";
  baseUrl: string = "https://stark-shelf-74007.herokuapp.com/wbgs";
  filterWords: any = ["the", "a", "an", "and", ",", ":", ";"];

  stringToArray(str) {
    return str.replace(/([,.])/g,"").trim().split(" ");
  }
  
  filterKeywords(arr) {
    this.searchTerm = arr.filter(word => !this.filterWords.includes(word))
  }

  clearSearch() {
    this.noSearchResults = "";
    this.searchTerm = "";
    this._wine.clearWbgInputs;
    sessionStorage.clear();
  }

  searchWBG() {
    this.searchResults = [];
    delete this.NegativeSearchTerm;
    delete this.noSearchResults;
    this.PositiveSearchResult = false;
    this.router.navigateByUrl('/searchResults')
    let myTerm = this.searchInput.toLowerCase();
    delete this.searchInput;
    this.searchTerm = this.stringToArray(myTerm)

    console.log("string to array search term", this.searchTerm)

    this.filterKeywords(this.searchTerm)

    console.log("array after filter", this.searchTerm)

    //filtering search term through the backend "keywords" array
    const reqs = this.searchTerm.map(term => this.http.get(`${this.baseUrl}?filter[where][keywords]=${term}`))
    console.log("reqs pre forkjoin", reqs)
    return forkJoin(reqs)
    .subscribe(
      (response: [] []) => {
        //taking the response arrays and concatenating together
        this.searchResults = response.reduce((acc, curr) => acc.concat(curr), [])

        console.log("search results after forkJoin", this.searchResults)

          if (this.searchTerm.length > 1) {
            
          //filter to keep only the duplicates if search term is longer  (better for search)
          const sortedResults = []
          const sortedArray = this.searchResults.sort((a, b) => (a.id > b.id) ? 1 : -1)

          console.log("sorted array", sortedArray)
          
          for (let i = 0; i < sortedArray.length - 1; i++) {
            if(sortedArray[i + 1].id == sortedArray[i].id) {
              sortedResults.push(sortedArray[i])
            }
          }
          console.log("sorted results", sortedResults)
          this.searchResults = sortedResults
        }

          //filter the sorted arrays to remove duplicate objects
          this.searchResults = this.searchResults.filter((obj, index, self) => 
          index === self.findIndex((index) => (
            index.id === obj.id
          )))
          console.log("search results after filter", this.searchResults)

          if(this.searchResults[0]) {
            this.PositiveSearchTerm = this.searchTerm
            this.htmlPositiveSearchTerm = this.searchTerm.toString().replace(/,/g, ' ')

            console.log("positive result", this.PositiveSearchTerm, "array to string", this.htmlPositiveSearchTerm)

            this.clearSearch()
            this.PositiveSearchResult = true
          } else {
            this.NegativeSearchTerm = this.searchTerm.toString().replace(/,/g, ' ')
            this.noSearchResults = "No search results"
            this.searchTerm = ""

            console.log(this.noSearchResults, this.NegativeSearchTerm)

            this.router.navigateByUrl('/wbgList')
          }
      }
      )
  }
}
