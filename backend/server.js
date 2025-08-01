const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

const jwtRoute = require('./src/routes/jwtRoute');
const userRoute = require('./src/routes/userRoute');


app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use('/api', userRoute);
app.use('/api', jwtRoute);


app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
