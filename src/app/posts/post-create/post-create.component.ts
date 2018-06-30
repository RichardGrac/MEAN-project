import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {PostsService} from '../posts.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Post} from '../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit {

  public post: Post;
  private mode = 'create';
  private postId: string;
  public spinnerIsActive = false;

  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    /* Verificamos si es un nuevo post o una edición de post */
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.spinnerIsActive = true;
        this.postsService.getPost(this.postId)
          .subscribe(postData => {
            this.spinnerIsActive = false;
            this.post = {id: postData._id, title: postData.title, content: postData.content};
          }, (error) => {
            console.log('Error obteniendo Post: ', error.error.message);
          });
      }
    });
  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.spinnerIsActive = true;
    if (this.mode === 'edit') {
      this.postsService.updatePost(this.postId, form.value.title, form.value.content);
    } else {
      this.postsService.addPost(form.value.title, form.value.content);
    }
    form.resetForm();
  }
}
