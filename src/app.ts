import express, {Request, Response, NextFunction} from "express";
import fetch from 'node-fetch'
import {Client} from 'pg'

const port = process.env.PORT || 3000;
const app = express();

const CLIENT_ID = process.env.WITHINGS_CLIENT_ID
const CLIENT_SECRET = process.env.WITHINGS_CLIENT_SECRET
const REDIRECT_URI = `https://pederpus.no/auth/callback`;

function wrapAsync(fn: Function) {
    return function (req: Request, res: Response, next: NextFunction) {
        fn(req, res, next).catch(next);
    };
}

async function setupDb(client: Client) {
    await client.connect();
    const res = await client.query('SELECT table_schema,table_name FROM information_schema.tables;');
    console.log(res); // Hello world!
    await client.end()
}

if (process.env.NODE_ENV === 'production') {

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: true
    });

    setupDb(client);
}

app.get("/", (req, res) => res.send("Hello World!"));

app.get("/auth/callback", async (req: Request, res: Response) => {
    const code = req.query.code;
    const state = req.query.state;

    const url = `https://account.withings.com/oauth2/token`;
    const body = ` grant_type=authorization_code&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${code}&redirect_uri=${REDIRECT_URI}`;

    const response = await fetch(url, {
        method: "POST",

        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: body
    });

    let json = await response.json();
});

app.get("/auth/login", (req, res) => {
    const url = `https://account.withings.com/oauth2_user/authorize2?response_type=code&client_id=${CLIENT_ID}&state=foo&scope=user.metrics&redirect_uri=${REDIRECT_URI}`;
    res.redirect(url);
});

app.get('/error', wrapAsync(async (req: Request, res: Response) => {
    throw new Error('FU');
}));


app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    res.render(`${new Date()}`);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
