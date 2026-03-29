import { Component, input, output, ElementRef, inject } from '@angular/core';
import { Todo } from '../../model/todo.type';
import { HighlightCompletedTask } from '../../directives/highlight-completed-task';

@Component({
  selector: 'app-todo-item',
  imports: [ HighlightCompletedTask ],
  templateUrl: './todo-item.html',
  styleUrl: './todo-item.scss',
})
export class TodoItem {
  todo = input.required<Todo>();

  todoToggled = output<Todo>();
  removeToggled = output<Todo>();
  
  openEdit = false;
  editToggled = output<Todo>();


  rewriteClicked() {
    this.openEdit = !this.openEdit;
  }
  todoEdit(newTask: string) {
    this.todo().task = newTask;
    this.editToggled.emit(this.todo())
    this.rewriteClicked();
  }
  todoClicked() {
    this.todoToggled.emit(this.todo());
  }
  todoRemoved() {
    this.removeToggled.emit(this.todo())
  }
}
