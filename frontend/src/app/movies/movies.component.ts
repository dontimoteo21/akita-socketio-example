import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MoviesQuery, MoviesService } from './state';


@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent implements OnInit {
  movies$: Observable<Movie[]>;
  actors$: Observable<Actor[]>;
  isLoading$: Observable<boolean>;
  private edits = new Set();

  constructor(private moviesQuery: MoviesQuery, private moviesService: MoviesService) {}

  ngOnInit() {
    this.isLoading$ = this.moviesQuery.selectLoading();
    this.movies$ = this.moviesQuery.selectMovies();
    this.moviesService.getMovies();
  }

  edit(id: ID, name: string) {
    this.moviesService.updateActorName(id, name);
    this.edits.delete(id);
  }

  toggleView(id: ID, actorName: HTMLInputElement) {
    if (this.edits.has(id)) {
      this.edits.delete(id);
    } else {
      this.edits.add(id);
      actorName.focus();
    }
  }

  inEditMode(id: ID) {
    return this.edits.has(id);
  }
}
