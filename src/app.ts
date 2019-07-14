import express, { Request, Response, NextFunction} from "express";

const port = process.env.PORT || 3000;
const app = express();

const CLIENT_ID = `${process.env.WITHINGS_CLIENT_ID}`;
const CLIENT_SECRET = `${process.env.WITHINGS_CLIENT_SECRET}`;
const REDIRECT_URI = `https://pederpus.no/auth/callback`;

function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(500);
  res.render("error", { error: err });
}

app.get("/", (req, res) => res.send("Hello World!"));

app.get("/auth/callback", async (req: Request, res: Response) => {
  // const code = req.params.code;
  // const state = req.params.state;
  const url = `https://account.withings.com/oauth2/token`;

  return url

  // return res.render(code);

  // const response = await fetch(url, {
  //   method: "POST",
  //   body: JSON.stringify({
  //     grant_type: "authorization_code",
  //     client_id: CLIENT_ID,
  //     client_secret: CLIENT_SECRET,
  //     code: code,
  //     redirect_uri: REDIRECT_URI
  //   })
  // });
  //
  // response.json();
  // return response;
});

app.get("/auth", (req, res) => {
  const url = `https://account.withings.com/oauth2_user/authorize2?response_type=code&client_id=${CLIENT_ID}&state=foo&scope=user.metrics&redirect_uri=${REDIRECT_URI}`;
  res.redirect(url);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
