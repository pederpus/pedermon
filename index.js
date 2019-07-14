const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => res.send('Hello World!'))
app.get('/auth/callback', (req, res) => res.send('Hello'))
app.get('/auth', (req, res) => {
    const url = `https://account.withings.com/oauth2_user/authorize2?response_type=code&client_id=${process.env.WITHINGS_CLIENT_ID}&state=foo&scope=user.metrics&redirect_uri=https://pederpus.no/auth/callback`
    res.redirect(url)
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
