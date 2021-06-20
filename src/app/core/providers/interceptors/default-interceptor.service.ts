import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class DefaultInterceptor implements HttpInterceptor {
  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(
        (event) => {
          if (event instanceof HttpResponse) {
            this.checkForAuthToken(event);
            this.notifyOnError(event);
          }
        },
        (err) => {
          if (err instanceof HttpErrorResponse) {
            this.notifyOnError(err);
          } else {
            this.displayErrorNotification(err.message);
          }
        }
      )
    );
  }

  private notifyOnError(response: HttpResponse<any> | HttpErrorResponse) {
    if (response instanceof HttpErrorResponse) {
      if (response.status === 0) {
        this.displayErrorNotification('Could not connect to server!');
      } else {
        this.displayErrorNotification(response.toString());
      }
    } else {
      // GraphQL errors still return 200 OK responses, but have the actual error message
      // inside the body of the response.
      const graqhQLErrors = response.body.errors;
      if (graqhQLErrors && Array.isArray(graqhQLErrors)) {
        const firstCode: string = graqhQLErrors[0].extensions.code;
        if (firstCode === 'FORBIDDEN') {
          // auto logout needed?
        } else if (firstCode === 'CHANNEL_NOT_FOUND') {
          const message = graqhQLErrors.map((err) => err.message).join('\n');
          this.displayErrorNotification(message);
        } else {
          const message = graqhQLErrors.map((err) => err.message).join('\n');
          this.displayErrorNotification(message);
        }
      }
    }
  }

  /**
   * We need to lazily inject the NotificationService since it depends on the I18nService which
   * eventually depends on the HttpClient (used to load messages from json files). If we were to
   * directly inject NotificationService into the constructor, we get a cyclic dependency.
   */
  private displayErrorNotification(message: string): void {
    console.log(message);
  }

  /**
   * If the server is configured to use the "bearer" tokenMethod, each response should be checked
   * for the existence of an auth token.
   */
  private checkForAuthToken(response: HttpResponse<any>) {
    if (
      environment.tokenMethod === 'bearer' &&
      isPlatformBrowser(this.platformId)
    ) {
      const authToken = response.headers.get('vendure-auth-token');
      if (authToken) {
        localStorage.setItem('authToken', authToken);
      }
    }
  }
}
