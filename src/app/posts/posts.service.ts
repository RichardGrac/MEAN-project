import {Post} from './post.model';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';

// Para hacerle saber a Angular que tendrémos una sola instancia de ésta clase
@Injectable({providedIn: 'root'})
export class PostsService {

  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  private URL = 'http://127.0.0.1:3000/api/posts';

  constructor(private http: HttpClient,
              private router: Router) {
  }

  // Para retornar una copia de el objeto 'posts' y no la referencia
  getPosts() {
    // return [...this.posts];
    this.http.get<{ message: string, posts: any }>(this.URL)
      .pipe(map((postData) => {
        /* Para el arreglo de Posts convertiremos cada post en un objeto del de nosotros */
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          };
        });
      }))
      .subscribe((transformedData) => {
        this.posts = transformedData;
        // this.posts.forEach((post) => console.log(post));
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    // return {...this.posts.find(p => p.id === id)};
    return this.http.get<{_id: string, title: string, content: string}>
    (this.URL + '/' + id);
  }

  addPost(title: string, content: string) {
    console.log('Adding Post...');
    const post: Post = {id: null, title: title, content: content};
    this.http.post<{ message: string, postId: string }>(this.URL, post)
      .subscribe((responseData) => {
        // Seteamos el id que se autogenero en el servidor
        post.id = responseData.postId;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
    this.router.navigate(['/']);
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = {id: id, title: title, content: content};
    this.http
      .put(this.URL + '/' + id, post)
      .subscribe(response => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
    this.router.navigate(['/']);
  }

  deletePost(postId: string) {
    this.http.delete(this.URL + '/' + postId)
      .subscribe(() => {
        // updatedPosts será el nuevo array ya sin el elemento que eliminamos
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        // Hacemos saber al componente post-list que hay actualización de los posts
        this.postsUpdated.next([...this.posts]);
      });
  }
}
