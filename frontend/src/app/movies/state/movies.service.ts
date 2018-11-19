import { Injectable } from '@angular/core';
import { MoviesStore } from './movies.store';
import { eMoviesAPIRoute } from '../movies-route';
import { HttpClient } from "@angular/common/http";
import { Socket } from "ngx-socket-io";
import { Movie } from './movie.model';
import { tap } from 'rxjs/operators';
import { ID } from '@datorama/akita';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  constructor(private http: HttpClient, private socket: Socket, private moviesStore: MoviesStore) { }

  private addSocketIOListeners(): void {
    this.socket.on(eMoviesAPIRoute.add, (movie: Movie) => {
      this.moviesStore.add(movie);
    });
    this.socket.on(eMoviesAPIRoute.delete, (id: ID) => {
      this.moviesStore.remove(id);
    });
    this.socket.on(eMoviesAPIRoute.update, (movie: Movie) => {
      this.moviesStore.update(movie.id, movie);
    });
  }

  private removeSocketIOListeners(): void {
    this.socket.removeAllListeners(eMoviesAPIRoute.add);
    this.socket.removeAllListeners(eMoviesAPIRoute.delete);
    this.socket.removeAllListeners(eMoviesAPIRoute.update);
  }

  active() {
    this.addSocketIOListeners();
    this.getAll();
  }

  deactive() {
    this.removeSocketIOListeners();
    this.resetStore();
  }

  private resetStore() {
    this.moviesStore.set({});
    this.moviesStore.setPristine();
  }

  getAll() {
    return this.http.get<Movie[]>(eMoviesAPIRoute.getAll).pipe(
      tap(movies => {
        this.moviesStore.set(movies);
      }));
  }

  add(movie: Movie) {
    return this.http.post<boolean>(eMoviesAPIRoute.add, movie);
  }

  update(movie: Movie) {
    return this.http.put<boolean>(eMoviesAPIRoute.update, movie);
  }

  delete(_id: string) {
    return this.http.delete<boolean>(`${eMoviesAPIRoute.delete}/${_id}`);
  }
}
