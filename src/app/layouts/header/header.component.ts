import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LogoComponent } from '../../icons/logo.component';

@Component({
    selector: 'ani-header',
    imports: [RouterLink, RouterLinkActive, LogoComponent],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderLayout {}
