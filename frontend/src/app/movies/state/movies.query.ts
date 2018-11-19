import { Injectable } from '@angular/core';
import { MoviesStore, State } from './movies.store';
import { Movie } from './movie.model';
import {QueryEntity} from '@datorama/akita';

  @Injectable({
    providedIn: 'root'
  })
  export class MoviesQuery extends QueryEntity<State, Movie> {
    constructor(protected store: MoviesStore) {
      super(store);
    }
  }