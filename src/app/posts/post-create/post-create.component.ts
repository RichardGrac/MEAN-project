import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {PostsService} from '../posts.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Post} from '../post.model';
import {mimeType} from './mime-type.validator';

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
  form: FormGroup;
  imagePreview: string;

  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    /* Inicializamos los inputs de nuestro formulario: Forma Reactiva */
    this.form = new FormGroup({
      'title': new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(3)
        ]
      }),
      // 'null' es el texto inicial del input
      'content': new FormControl(null, {
        validators: [
          Validators.required
        ]
      }),
      'image': new FormControl(null, {
        validators: [
          Validators.required
        ],
        asyncValidators: [
          mimeType
        ]
      })
    });

    /* Verificamos si es un nuevo post o una edición de post */
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.spinnerIsActive = true;
        this.postsService.getPost(this.postId)
          .subscribe(postData => {
            this.spinnerIsActive = false;
            this.post = {
              id: postData._id,
              title: postData.title,
              content: postData.content,
              imagePath: postData.imagePath
            };
            /* Si es una edición de Post, inicializamos inputs del FormGroup */
            this.form.setValue({
              'title': this.post.title,
              'content': this.post.content,
              'image': this.post.imagePath
            });
          }, (error) => {
            console.log('Error obteniendo Post: ', error.error.message);
          });
      }
    });
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.spinnerIsActive = true;
    if (this.mode === 'edit') {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    } else {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }
    this.form.reset();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    // Guardamos el objeto File
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    console.log(file);
    console.log(this.form);
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
}
