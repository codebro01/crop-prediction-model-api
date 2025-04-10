import axios from 'axios'
import express, { response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import hpp from 'hpp'
import { swaggerSpec, swaggerUi } from './swagger.js'

const app = express()

// allow request from anywhere
app.use(
  cors({
    origin: '*',
    methods: ['POST'],
    allowedHeaders: ['content-Type'],
  })
)
// 🧠 Secure HTTP headers
app.use(helmet())

// 🧼 Prevent HTTP param pollution
app.use(hpp())

// 🚥 Rate limiting — protect from abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, try again in 15 minutes',
})
app.use(limiter)

app.use(express.json())

const port = process.env.PORT || 5100

/**
 * @swagger
 * /api/v1/predict:
 *   get:
 *     summary: Welcome message
 *     description: Returns a welcome message for the crop prediction API.
 *     responses:
 *       200:
 *         description: Welcome message
 *
 *   post:
 *     summary: Predict crop type
 *     description: Sends data to the ML model and returns the predicted crop.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               temperature:
 *                 type: number
 *               humidity:
 *                 type: number
 *               pH:
 *                 type: number
 *               rainfall:
 *                 type: number
 *     responses:
 *       200:
 *         description: The predicted crop
 */

app.get('/api/v1/predict', (req, res) => {
  res.send('WELCOME TO CROP PREDICTION API')
})

app.post('/api/v1/predict', async (req, res) => {
  const { temperature, humidity, pH, rainfall } = req.body

  if (
    typeof temperature !== 'number' ||
    typeof humidity !== 'number' ||
    typeof pH !== 'number' ||
    typeof rainfall !== 'number'
  ) {
    return res.status(400).json({response: "Only numbers are allowed"});
  }

  // console.log(typeof temperature)

  const features = [temperature, humidity, pH, rainfall]
  // console.log(features);
  // console.log(req.body);
  try {
    const response = await axios.post(
      'https://crop-prediction-model-uxtd.onrender.com/predict',
      // 'http://localhost:5000/predict',
      {
        features,
      }
    )

    // console.log(response)
    res.status(200).json({ response: response.data.prediction })
  } catch (error) {
    console.error('Prediction error:', error.message)
  }
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Example usage
// predictWithPythonModel([5.1, 3.5, 1.4, 0.2]) // assuming you're predicting on iris-like data

app.listen(port, () => console.log(`Server is running on port: ${port}`))
