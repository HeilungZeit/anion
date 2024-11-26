import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'ani-player-iframe',
  standalone: true,
  imports: [CommonModule],
  template: `
    <iframe
      #player
      class="player"
      frameborder="0"
      width="100%"
      height="700px"
      *ngIf="url()"
      [srcdoc]="getIframeSrcDoc(url())"
      frameborder="0"
      loading="lazy"
      allowfullscreen
    >
    </iframe>
  `,
  styles: [
    `
      .player {
        border-radius: 12px;
        overflow: hidden;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerIframeComponent implements OnInit {
  url = input.required<string>();

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    console.log(this.url());
  }

  getIframeSrcDoc(url: string): SafeHtml {
    const srcDoc = `
      <!DOCTYPE html>
      <html style="overflow: hidden;">
        <head>
          <meta http-equiv="Content-Security-Policy" 
                content="default-src 'self' ${url} 'unsafe-inline' 'unsafe-eval'; 
                         connect-src 'none';">
        </head>
        <body style="margin:0">
          <iframe src="${url}" 
                  style="width:100%;height:100vh;border:none;" 
                  allowfullscreen>
          </iframe>
        </body>
      </html>
    `;
    return this.sanitizer.bypassSecurityTrustHtml(srcDoc);
  }
}
