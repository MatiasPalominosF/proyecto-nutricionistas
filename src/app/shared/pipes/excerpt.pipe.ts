import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'excerpt' })
export class ExcerptPipe implements PipeTransform {
  transform(text: string, limit: number = 5) {
    if (text.length <= limit) {// Se verifica si la longitud del texto es menor o igual al límite
      return text;// Si es así, se devuelve el texto original sin cambios
    }
    return text.substring(0, limit) + '...';// Si la longitud del texto es mayor que el límite, se recorta y se agrega "..." al final
  }
}
