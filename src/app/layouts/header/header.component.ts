import { Component, Inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TUI_SANITIZER, TuiSvgModule, TuiSvgService } from '@taiga-ui/core';
import { tuiIconApertureLarge } from '@taiga-ui/icons';
import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';

@Component({
  selector: 'ani-header',
  standalone: true,
  imports: [TuiSvgModule, RouterLink, RouterLinkActive],
  providers: [
    {
      provide: TUI_SANITIZER,
      useClass: NgDompurifySanitizer,
    },
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderLayout {
  constructor(@Inject(TuiSvgService) tuiSvgService: TuiSvgService) {
    tuiSvgService.define({ tuiIconApertureLarge });
  }
}
