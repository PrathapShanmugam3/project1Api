const express = require('express');
const cors=require('cors');

const cronJobs = require('./mailConfig/cronjob');
const app = express()
const port = 3000


app.use(cors());
app.use(express.json());

const route=require('./router/router')
const mailRouter=require('./router/mailRouter')




app.use('/base',route)
app.use('/mail',mailRouter)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))