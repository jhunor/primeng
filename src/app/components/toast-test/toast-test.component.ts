import { AsyncPipe, CommonModule, JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { Message, MessageService } from 'primeng/api';
import { Toast, ToastModule } from 'primeng/toast';
import {
  Subscription
} from 'rxjs';
import {
  ToastServiceService,
  durationMS,
} from '../../services/toast-service.service';

@Component({
  selector: 'app-toast-test',
  standalone: true,
  imports: [ToastModule, JsonPipe, AsyncPipe, CommonModule],
  providers: [MessageService],
  templateUrl: './toast-test.component.html',
  styleUrl: './toast-test.component.css'
})
export class ToastTestComponent implements OnDestroy {
  @ViewChild('myToast') myToast!: Toast;

  public readonly durationMS = durationMS;
  public elementTimes$ = this._toastService.elements;

  private _subscriptions: Subscription = new Subscription();

  constructor(
    private readonly _messageService: MessageService,
    private readonly _changeDetector: ChangeDetectorRef,
    private readonly _elementRef: ElementRef,
    private readonly _toastService: ToastServiceService
  ) {}

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  public showToast(): void {
    const id = Math.random();
    this._toastService.registerToast(id);
    this._messageService.add({
      severity: 'success',
      summary: 'My toast',
      detail: 'The detailed message',
      id,
      life: this.durationMS,
    });
  }
  public delayToasts(messageid: number): void {
    const messages: Message[] | null | undefined = this.myToast.messages;
    if (messages !== null && messages !== undefined) {
      this._toastService.pauseToasts(messages);
      this._elementRef.nativeElement.querySelectorAll(
        'p-toastitem > div:not([id="' + messageid + '"])'
      ).forEach((el: any) => {
        el.dispatchEvent(new MouseEvent('mouseenter'));
      });  
    }
    
    
  }
  public resumeToasts(messageid: number): void {
    console.log('resuming toastas:');
    const msg: Message[] | null | undefined = this.myToast.messages;
    if (msg !== null && msg !== undefined) {
      this._toastService.resumeToasts(msg);
    }
    this._elementRef.nativeElement
      .querySelectorAll('p-toastitem > div:not([id="' + messageid + '"])')
      .forEach((el: any) => el.dispatchEvent(new MouseEvent('mouseleave')));
    
  }
  

  
}
