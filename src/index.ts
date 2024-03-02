import express, { Application, Express, Request, Response } from "express";

const app: Application = express();

const port = 3000;

app.get('/',(req: Request, res: Response) => {
    res.send('Server started');
})

app.get('/api/test', (req, res) => {
    res.send('Test Server running successfully')
})

app.listen(port, () => {
    console.log(`Server started on ${port}`);
})