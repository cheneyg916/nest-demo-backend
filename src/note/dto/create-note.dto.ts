import { IsNotEmpty } from 'class-validator';

export class CreateNoteDto {
  @IsNotEmpty({ message: '标题不能为空' })
  title: string;

  @IsNotEmpty({ message: '内容不能为空' })
  content: string;
}
