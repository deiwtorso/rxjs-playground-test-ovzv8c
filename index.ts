import {
  BehaviorSubject,
  combineLatest,
  concat,
  forkJoin,
  fromEvent,
  iif,
  merge,
  zip,
} from 'rxjs';
import {
  distinctUntilChanged,
  first,
  map,
  mergeAll,
  share,
  take,
  withLatestFrom,
} from 'rxjs/operators';

const themeButton = document.getElementById('1');
const sectionButton = document.getElementById('2');
const pageButton = document.getElementById('3');

const themeEvent$ = fromEvent(themeButton, 'click');
const sectionEvent$ = fromEvent(sectionButton, 'click');
const pageEvent$ = fromEvent(pageButton, 'click');

const theme$ = new BehaviorSubject<'first' | 'second'>('first');
const section$ = new BehaviorSubject<'a' | 'b' | 'all'>('all');
const page$ = new BehaviorSubject<number>(0);

const themeSection$ = combineLatest(theme$, section$).pipe(
  map((count) => {
    section$.next('all');
    page$.next(0);
    return count[0];
  })
);

// const sectionPage$ = zip(section$, page$).pipe(
//   map((count) => {
//     page$.next(0);
//     return count;
//   })
// );

const sectionPage$ = combineLatest(section$).pipe(
  map((count) => {
    page$.next(0);
    return count[0];
  })
);

// const sectionPage$ = concat(section$,page$).pipe(
//   map((count) => {
//     page$.next(0);
//     return count;
//   })
// );

const data$ = page$.pipe(
  withLatestFrom(
    sectionPage$.pipe(
      withLatestFrom(theme$)
      // map((arr) => {
      //   return [...arr];
      // })
    )
  ),
  map((arr) => {
    return [arr[0], ...arr[1]];
  })
);
// let data$ = combineLatest(sectionPage$, page$)
// let data$ = combineLatest(themeSection$, sectionPage$, page$)
//   .pipe
// distinctUntilChanged((prev, curr) => {
//   // console.log(prev, curr);
//   let booleans: boolean[] = [];
//   prev.forEach((val, idx, arr) => {
//     booleans.push(val !== curr[idx]);
//   });
//   if (
//     booleans.includes(true) &&
//     booleans.indexOf(true) === booleans.lastIndexOf(true)
//   )
//     return false;
//   return true;
// })
// ();

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
