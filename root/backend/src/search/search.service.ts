import { Injectable } from '@nestjs/common';
import { from, of, throwError } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';
import { User } from './user.interface';

const users: User[] = [
  { email: 'jim@gmail.com', number: '221122' },
  { email: 'jam@gmail.com', number: '830347' },
  { email: 'john@gmail.com', number: '221122' },
  { email: 'jams@gmail.com', number: '349425' },
  { email: 'jams@gmail.com', number: '141424' },
  { email: '‘jill@gmail.com', number: '822287' },
  { email: '‘jill@gmail.com', number: '822286' },
];

@Injectable()
export class SearchService {
  search(email: string, number?: string) {
    return of(users).pipe(
      delay(5000),
      map((users) =>
        users.filter((user) => {
          return user.email === email && (!number || user.number === number);
        }),
      ),
      catchError((err) => throwError(() => new Error('Error searching users'))),
    );
  }
}
