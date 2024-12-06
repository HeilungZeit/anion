import { Component } from '@angular/core';
import { ContentLayout } from '../../layouts/content/content.component';

@Component({
    selector: 'app-catalog',
    imports: [ContentLayout],
    templateUrl: './catalog.component.html',
    styleUrl: './catalog.component.scss'
})
export class CatalogComponent {}
