import {Component, OnDestroy, OnInit} from '@angular/core';
import {Post} from '../post.model';
import {PostsService} from '../posts.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postsSub: Subscription;
  public spinnerIsActive = false;

  constructor(private postService: PostsService) {
  }

  ngOnInit(): void {
    this.spinnerIsActive = true;
    this.postService.getPosts();
    this.postsSub = this.postService.getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.spinnerIsActive = false;
        this.posts = posts;
      });
  }

  // Previene desperdicios de memoria al salir del componente.
  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }

  onDelete(postId: string) {
    this.postService.deletePost(postId);
  }
}
