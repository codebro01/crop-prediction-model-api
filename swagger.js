import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Crop Prediction API',
      version: '1.0.0',
      description:
        'Node.js API that consumes a Flask ML model for crop prediction',
    },
    servers: [
      {
        url: 'http://localhost:5100', // Change to your production URL later
      },
    ],
  },
  apis: ['./server.js'], // Path to your docs (can use glob patterns too)
}

const swaggerSpec = swaggerJsdoc(swaggerOptions)

export { swaggerSpec, swaggerUi }
