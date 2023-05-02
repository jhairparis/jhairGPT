import { Component } from '@angular/core';
import { Hero } from '../nav';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.less'],
})
export class NavComponent {
  hero: Hero = {
    id: 1,
    name: '',
  };

  name: string = 'Jhair';
  setValue() {
    this.name = 'Nancy';
  }

  list: string[] = ['Jhair', 'Nancy', 'Juan', 'Pedro'];

  select(people: string) {
    this.hero.name = people;
  }
}
