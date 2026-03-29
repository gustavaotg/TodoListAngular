import { Injectable, inject } from '@angular/core';
import { Todo } from '../model/todo.type';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  http = inject(HttpClient);
  private url = 'http://localhost:3000/todos';


  getTodosFromApi() {
    return this.http.get<Array<Todo>>(this.url);
  }

  postTodoToApi(task: string) {
    return this.http.post<Todo>(this.url, { task });
  }

  updateCheckedFromApi(id: number, completed: boolean) {
    return this.http.put<Todo>(`${this.url}/${id}`, { completed });
  }

  updateTaskFromApi(id: number, newTask: string) {
    return this.http.put<Todo>(`${this.url}/edit/${id}`, { newTask });
  }

  deleteTodoFromApi(id: number) {
    return this.http.delete<Todo>(`${this.url}/${id}`);
  }
}
