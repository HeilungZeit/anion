import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';
import {
  TuiRootModule,
  TuiDialogModule,
  TuiAlertModule,
  TUI_SANITIZER,
  TuiButtonModule,
  TuiThemeNightModule,
  TuiModeModule,
  TuiNightThemeService,
} from '@taiga-ui/core';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';

import { ShikimoriService } from './services/shikimori/shikimori.service';
import { AnimesStore } from './store/animes.store';
import { HeaderLayout } from './layouts/header/header.component';
import { FooterLayout } from './layouts/footer/footer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    TuiRootModule,
    TuiDialogModule,
    TuiAlertModule,
    TuiButtonModule,
    TuiThemeNightModule,
    TuiModeModule,
    TuiThemeNightModule,
    TuiModeModule,
    HeaderLayout,
    FooterLayout,
  ],
  templateUrl: './app.component.html',
  providers: [
    { provide: TUI_SANITIZER, useClass: NgDompurifySanitizer },
    ShikimoriService,
    AnimesStore,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor(
    @Inject(TuiNightThemeService) readonly night$: Observable<boolean>
  ) {}
}
