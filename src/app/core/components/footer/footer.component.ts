import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer', // This is the selector used in app.component.html
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'] // Or './footer.component.css'
})
export class FooterComponent implements OnInit {

  currentYear: number;

  constructor() {
    this.currentYear = new Date().getFullYear(); // Get the current year
  }

  ngOnInit(): void {
  }

}
