import dotenv from 'dotenv';
import app from './app';

// Documentations
import swaggerJsDoc, { Options } from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

dotenv.config();

const port = process.env.PORT || 3000;

/**** Documentation setup ****/
const swaggerOptions : Options  = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Documentation Sport Application ',
      version: '1.0.0',
      description: 'Backend documentation for a sport application',
    },
    servers: [
      { url: `http://localhost:${port}`, description: 'Development serveur' }
    ] // Susceptible de changer
  },
  apis: ['**/*.ts'] // NOTE doit absolument être ça
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
/*****************************/

app.listen(port, () => {
  console.log(`running on: http://localhost:${port}`);
});
