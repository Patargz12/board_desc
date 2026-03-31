
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import path from 'path';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Management API',
      version: '1.0.0',
      description: `API documentation for the Task Management system.\n\n**Authentication**:\n\nMost endpoints require a Bearer token.\n\n- Obtain a token via /auth/login.\n- Use the 'Authorize' button in Swagger UI and enter: Bearer <your-access-token>.\n- Example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`,
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [
    path.join(__dirname, '../routes/*.ts'),
    path.join(__dirname, '../controllers/*.ts'),
    path.join(__dirname, '../docs/*.yaml'),
    path.join(__dirname, '../docs/project.yaml'),
    path.join(__dirname, '../docs/task.yaml'),
  ], // Absolute path to the API docs and YAML
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
