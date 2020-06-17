import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { WineService } from '../wine.service';

@Component({
  selector: 'delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.css']
})

export class DeleteModalComponent implements OnInit {

  constructor(
    public el: ElementRef,
    public _wine: WineService
  ) { }

  @Input() wine: any;

  ngOnInit(): void {
  }

  close() {
    this.el.nativeElement.classList.remove('sshow')
    this.el.nativeElement.classList.add('hhidden')
}

}
