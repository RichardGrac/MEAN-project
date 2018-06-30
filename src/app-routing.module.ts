import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {PostListComponent} from './app/posts/post-list/post-list.component';
import {PostCreateComponent} from './app/posts/post-create/post-create.component';

const routes: Routes = [
  { path: '', redirectTo: 'mensajes', pathMatch: 'full'},
  { path: 'mensajes', component: PostListComponent },
  { path: 'nuevo-post', component: PostCreateComponent },
  { path: 'editar/:postId', component: PostCreateComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {

}
