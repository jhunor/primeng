import { Injectable, OnDestroy } from '@angular/core';
import { Message } from 'primeng/api/message';
import {
  BehaviorSubject,
  ReplaySubject,
  Subscription,
  interval,
  of,
  switchMap,
  takeUntil,
  takeWhile,
  tap,
  withLatestFrom,
} from 'rxjs';

export const durationMS = 3000;

@Injectable({
  providedIn: 'root',
})
export class ToastServiceService implements OnDestroy {
  private _toastContainer = new Map<number, number>();
  public toastsPaused = false;

  private _containerElements$$ = new ReplaySubject<Map<number, number>>(1);
  public elements = this._containerElements$$.asObservable();

  private _startCountdown$$ = new BehaviorSubject<boolean>(false);
  private _subscriptions = new Subscription();
  private readonly _timeUpdateStepMs = 200;
  constructor() {}

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  public resumeToasts(msg: Message[]): void {
    console.log('resuming toasts:');

    for (let i = 0; i < msg.length; i++) {
      msg[i].life =
        durationMS -
        (this._toastContainer.get(msg[i].id) ?? durationMS - 1);
        msg[i].sticky = false;
    }
    this.toastsPaused = false;
  }
  
  public pauseToasts(messages: Message[]) {
    console.log('delaying', messages.length, ' messages');
      messages.forEach((message) => {
        message.sticky = true;
      });
    this.toastsPaused = true;
  }

  public registerToast(id: number) {
    this._toastContainer.set(id, 0);
    if (this._toastContainer.size === 1) {
      this._startIncrement();
    }
    this._containerElements$$.next(this._toastContainer);
  }

  private _startIncrement() {
    console.log('starting increment');
    this._subscriptions.add(
      interval(this._timeUpdateStepMs)
        .pipe(
          withLatestFrom(this.elements),
          tap(([i, elements]) => {
            console.log('incrementing');
            const newMap = new Map();
            this._toastContainer.forEach((elapsedTime, messageId) => {
              if (elapsedTime <= durationMS) {
                newMap.set(messageId, 
                  
                  this.toastsPaused
                    ? elapsedTime
                    : elapsedTime + this._timeUpdateStepMs,
                );
              }
            });
            this._toastContainer = newMap;
            this._containerElements$$.next(newMap);
          }),
          takeWhile(([i, elements]) => {
            return elements.size > 0;
          })
        )
        .subscribe()
    );
  }
  
}
