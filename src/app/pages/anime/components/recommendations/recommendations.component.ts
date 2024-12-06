import { Component, inject, OnInit, signal } from '@angular/core';
import { YumiService } from '../../../../services/yumi/yumi.service';
import { ActivatedRoute } from '@angular/router';
import { map, take } from 'rxjs';
import { AnimeList } from '../../../../components/custom/list/list.component';

@Component({
  selector: 'app-recommendations',
  imports: [AnimeList],
  templateUrl: './recommendations.component.html',
  styleUrl: './recommendations.component.scss',
})
export class RecommendationsComponent implements OnInit {
  readonly yumiService = inject(YumiService);
  readonly route = inject(ActivatedRoute);
  readonly recommendations = signal<any[]>([]);

  ngOnInit(): void {
    this.route.params
      .pipe(
        map((params: { [key: string]: string }) => params['id']),
        take(1)
      )
      .subscribe(async (id) => {
        if (id) {
          const response = this.yumiService.getRecommendations(Number(id));
          this.recommendations.set(await response);
        }
      });
  }
}
