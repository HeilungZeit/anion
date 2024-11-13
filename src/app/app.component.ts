import { TuiRoot, TuiDialog, TuiAlert, TuiButton } from '@taiga-ui/core';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

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
    TuiRoot,
    TuiDialog,
    TuiAlert,
    TuiButton,
    HeaderLayout,
    FooterLayout,
  ],
  templateUrl: './app.component.html',
  providers: [ShikimoriService, AnimesStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
