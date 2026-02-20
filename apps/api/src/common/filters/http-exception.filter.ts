// apps/api/src/common/filters/http-exception.filter.ts

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiError } from '@aidesmax/shared';

/**
 * Filtre global pour formater toutes les exceptions HTTP
 * Produit des réponses conformes au type ApiError
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;
    let error: string;
    let details: Record<string, string[]> | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        error = HttpStatus[status] || 'Error';
      } else if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as Record<string, unknown>;
        message = (responseObj.message as string) || 'Une erreur est survenue';
        error = (responseObj.error as string) || HttpStatus[status] || 'Error';
        
        // Gestion des erreurs de validation (class-validator)
        if (Array.isArray(responseObj.message)) {
          message = 'Erreur de validation';
          details = this.formatValidationErrors(responseObj.message as string[]);
        }
      } else {
        message = 'Une erreur est survenue';
        error = 'Error';
      }
    } else if (exception instanceof Error) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Erreur interne du serveur';
      error = 'Internal Server Error';
      
      // Log l'erreur complète pour le debug (uniquement en dev)
      this.logger.error(
        `Exception non gérée: ${exception.message}`,
        exception.stack,
      );
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Erreur interne du serveur';
      error = 'Internal Server Error';
    }

    const errorResponse: ApiError = {
      statusCode: status,
      message,
      error,
      details,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(errorResponse);
  }

  /**
   * Formate les erreurs de validation class-validator
   */
  private formatValidationErrors(messages: string[]): Record<string, string[]> {
    const details: Record<string, string[]> = {};
    
    for (const msg of messages) {
      // Format attendu: "field - contrainte message" ou juste "message"
      const match = msg.match(/^(\w+)\s*[-:]\s*(.+)$/);
      if (match) {
        const [, field, error] = match;
        if (!details[field]) {
          details[field] = [];
        }
        details[field].push(error);
      } else {
        if (!details['_global']) {
          details['_global'] = [];
        }
        details['_global'].push(msg);
      }
    }
    
    return details;
  }
}
