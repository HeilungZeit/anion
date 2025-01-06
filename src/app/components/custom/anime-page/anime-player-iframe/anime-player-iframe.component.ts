import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'ani-player-iframe',
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
export class PlayerIframeComponent {
  url = input.required<string>();

  constructor(private sanitizer: DomSanitizer) {}

  getIframeSrcDoc(url: string): SafeHtml {
    const baseUrl = new URL(url).origin;

    const srcDoc = `
      <!DOCTYPE html>
      <html style="overflow: hidden;">
        <head>
         <meta http-equiv="Content-Security-Policy" 
                content="default-src 'self' ${baseUrl} 'unsafe-inline' 'unsafe-eval';
                         frame-src ${baseUrl} https://*.video-lk-ok-ii.store/;
                         connect-src ${baseUrl} https://img.yani.tv/ https://*.video-lk-ok-ii.store/;
                         media-src ${baseUrl} https://*.video-lk-ok-ii.store/">
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
