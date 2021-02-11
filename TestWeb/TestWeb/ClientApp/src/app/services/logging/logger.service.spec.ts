import { TestBed, inject } from '@angular/core/testing';
import { LoggerService, LOG_ADAPTER } from './logger.service';
import { LogAdapter } from './log-adapter';

describe('LoggerService', () => {
    const logAdapter = jasmine.createSpyObj<LogAdapter>(['trackException', 'trackEvent', 'debug', 'info', 'warn']);

    beforeEach(() =>
        TestBed.configureTestingModule({
            providers: [{ provide: LOG_ADAPTER, useValue: logAdapter, multi: true }]
        })
    );

    it('should be created', inject([LoggerService], (service: LoggerService) => {
        expect(service).toBeTruthy();
    }));

    it('should log events to all adapters', inject([LoggerService], (service: LoggerService) => {
        const properties = {};
        service.event('event', properties);

        expect(logAdapter.trackEvent).toHaveBeenCalledWith('event', properties);
    }));

    it('should log errors to all adapters', inject([LoggerService], (service: LoggerService) => {
        const error = new Error();
        const properties = {};
        service.error('error', error, properties);

        expect(logAdapter.trackException).toHaveBeenCalledWith('error', error, properties);
    }));

    it('should log warnings to adapters', inject([LoggerService], (service: LoggerService) => {
        const properties = {};
        service.warn('warn', properties);
        expect(logAdapter.warn).toHaveBeenCalledWith('warn', properties);
    }));
    it('should log info logs to adapters', inject([LoggerService], (service: LoggerService) => {
        const properties = {};
        service.info('info', properties);
        expect(logAdapter.info).toHaveBeenCalledWith('info', properties);
    }));
    it('should log debug logs to adapters', inject([LoggerService], (service: LoggerService) => {
        const properties = {};
        service.debug('debug', properties);
        expect(logAdapter.debug).toHaveBeenCalledWith('debug', properties);
    }));
});
