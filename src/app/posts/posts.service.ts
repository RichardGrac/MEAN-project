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
            id: post._id,
            imagePath: post.imagePath
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
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string }>
    (this.URL + '/' + id);
  }

  addPost(title: string, content: string, image: File) {
    console.log('Adding Post...');
    // Combina valores de Texto y BLOB's
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http.post<{ message: string, post: Post }>(this.URL, postData)
      .subscribe((responseData) => {
        // Seteamos el id que se autogenero en el servidor
        const post: Post = {
          id: responseData.post.id,
          title: title,
          content: content,
          imagePath: responseData.post.imagePath
        };
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        // Ir a componente raíz
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string ) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {id: id, title: title, content: content, imagePath: image};
    }
    // const post: Post = {id: id, title: title, content: content, imagePath: null };
    this.http
      .put(this.URL + '/' + id, postData)
      .subscribe(response => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        const post: Post = {
          id: id, title: title, content: content, imagePath: ''
        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
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
