import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TuiIcons } from '@taiga-ui/core';

@Component({
  selector: 'ani-header',
  standalone: true,
  imports: [TuiIcons, RouterLink, RouterLinkActive],

  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderLayout {}
