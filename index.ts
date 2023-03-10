import { BehaviorSubject, combineLatest, filter, fromEvent } from 'rxjs';
import { map, tap } from 'rxjs/operators';

const themeButton = document.getElementById('1');
const sectionButton = document.getElementById('2');
const pageButton = document.getElementById('3');

const themeEvent$ = fromEvent(themeButton, 'click');
const sectionEvent$ = fromEvent(sectionButton, 'click');
const pageEvent$ = fromEvent(pageButton, 'click');

const page$ = new BehaviorSubject<number>(0);
const section$ = new BehaviorSubject<'a' | 'b' | 'all'>('all');
const theme$ = new BehaviorSubject<'first' | 'second'>('first');

const themeSection$ = theme$.pipe(tap((_) => section$.next('all')));
const sectionPage$ = section$.pipe(tap((_) => page$.next(0)));

const data$ = combineLatest([page$, sectionPage$, themeSection$]).pipe(
  filter((arr) => !(arr[1] !== section$.value || arr[2] !== theme$.value))
);

themeEvent$.subscribe(() => {
  if (theme$.value === 'first') theme$.next('second');
  else theme$.next('first');
  console.log('theme changed; now', theme$.value);
});
sectionEvent$.subscribe(() => {
  if (section$.value === 'all') section$.next('a');
  else if (section$.value === 'a') section$.next('b');
  else section$.next('all');
  console.log('section changed; now', section$.value);
});
pageEvent$.subscribe(() => {
  page$.next(page$.value + 1);
  console.log('page changed; now', page$.value);
});

data$.subscribe(console.log);
// section$.subscribe(console.log);
// page$.subscribe(console.log);
