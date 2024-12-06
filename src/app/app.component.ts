import { TuiRoot } from '@taiga-ui/core';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { ShikimoriService } from './services/shikimori/shikimori.service';
import { AnimesStore } from './store/animes.store';
import { HeaderLayout } from './layouts/header/header.component';
import { NgProgressbar } from 'ngx-progressbar';
import { NgProgressRouter } from 'ngx-progressbar/router';

@Component({
    selector: 'app-root',
    imports: [
        CommonModule,
        RouterOutlet,
        TuiRoot,
        HeaderLayout,
        NgProgressbar,
        NgProgressRouter,
    ],
    templateUrl: './app.component.html',
    providers: [ShikimoriService, AnimesStore],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {}
