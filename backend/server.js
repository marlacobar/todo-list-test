const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

const jwtRoute = require('./src/routes/jwtRoute');
const userRoute = require('./src/routes/userRoute');
const carRoute = require('./src/routes/carRoute');


app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use('/api', jwtRoute);
app.use('/api', userRoute);
app.use('/api', carRoute);


app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
