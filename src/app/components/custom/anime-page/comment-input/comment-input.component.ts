import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TuiButton, TuiError, TuiIcon, TuiLabel } from '@taiga-ui/core';
import { TUI_VALIDATION_ERRORS, TuiFieldErrorPipe } from '@taiga-ui/kit';
import {
  TuiTextareaModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/legacy';
import { maxLengthMessageFactory } from '../../../helpers/factories';

@Component({
  selector: 'ani-comment-input',
  standalone: true,
  imports: [
    TuiTextareaModule,
    FormsModule,
    ReactiveFormsModule,
    TuiLabel,
    TuiTextfieldControllerModule,
    TuiError,
    TuiFieldErrorPipe,
    AsyncPipe,
    TuiButton,
    TuiIcon,
  ],
  templateUrl: './comment-input.component.html',
  styleUrl: './comment-input.component.scss',
  providers: [
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: {
        required: 'Введите комментарий',
        maxlength: maxLengthMessageFactory,
        minlength: 'Минимальная длина комментария 10 символов',
      },
    },
  ],
})
export class CommentInputComponent {
  protected readonly maxLength = 500;
  protected readonly minLength = 10;

  protected readonly commentForm = new FormGroup({
    comment: new FormControl('', [
      Validators.maxLength(this.maxLength),
      Validators.minLength(this.minLength),
    ]),
  });

  onSubmit() {
    if (this.commentForm.valid) {
      console.log('Form Submitted', this.commentForm);
      // Добавить логику сабмита
    }
  }
}
