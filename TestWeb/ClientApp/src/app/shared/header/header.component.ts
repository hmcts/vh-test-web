import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TopMenuItems } from './top-menu-items';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() loggedIn: boolean;
  topMenuItems = [];

  constructor(private router: Router) {}

  ngOnInit() {
      this.topMenuItems = TopMenuItems;
  }

  navigateToSelectedMenuItem(indexOfItem: number) {
    for (const item of this.topMenuItems) {
        item.active = false;
    }
    this.topMenuItems[indexOfItem].active = true;
    this.router.navigate([this.topMenuItems[indexOfItem].url]);
  }
}