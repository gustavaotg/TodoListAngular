import { Component, inject, OnInit, signal, output } from '@angular/core';
import { TodosService } from '../services/todos';
import { Todo } from '../model/todo.type';
import { catchError } from 'rxjs';
import { TodoItem } from '../components/todo-item/todo-item';
import { FilterTodosPipe } from '../pipe/filter-todos-pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todos',
  imports: [TodoItem, FormsModule, FilterTodosPipe],
  templateUrl: './todos.html',
  styleUrl: './todos.scss',
})
export class Todos implements OnInit {
  todoService = inject(TodosService)
  todoItems = signal<Array<Todo>>([])
  searchTerm = signal('');
  
  ngOnInit(): void {
    this.todoService
    .getTodosFromApi()
    .pipe(
      catchError((err) => {
        console.log(err);
        throw err;
      })
    )
    .subscribe((todos) => {
      this.todoItems.set(todos)
    });
  }


  addToggled = output<string>();

  addTodoItem(todoTask: string) {
    if (todoTask === '') {
      return;
    } 
    this.todoService
    .postTodoToApi(todoTask)
    .subscribe((todo) => {
      this.todoItems.update((t) => [...t, todo]);
    });
  }



  updateTaskTodoItem(todoItem: Todo) {
    this.todoItems.update((todos) => {
      return todos.map((todo) => {
        if (todo.id === todoItem.id) {
          return {
            ...todo,
            task: todoItem.task,
          }
        }
        return todo;
      });
    });
    this.todoService
    .updateTaskFromApi(todoItem.id, todoItem.task)
    .subscribe();
  }


  updateTodoItem(todoItem: Todo) {
    this.todoItems.update((todos) => {
      return todos.map((todo) => {
        if (todo.id === todoItem.id) {
          return {
            ...todo,
            completed: !todo.completed,
          }
        }
        return todo;
      });
    });
    this.todoService
    .updateCheckedFromApi(todoItem.id, !todoItem.completed)
    .subscribe();
  }


  deleteTodoItem(todoItem: Todo) {
    this.todoItems.update((todos) => {
      return todos.filter((todo) => {
        return todo.id !== todoItem.id;
      });
    });
    this.todoService
    .deleteTodoFromApi(todoItem.id)
    .subscribe();
  }

}
