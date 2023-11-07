const express = require("express");
const fs = require("fs");
const axios = require("axios");
const url = require("url-generator");
const app = express();
const bodyParser = require("body-parser");

// const cred = require("./credentials.json");

// Generated https endpoint using ngrok for the port: 3333
// ngork http 3333
const serverUrl = "https://3333-narendrasg-jiraauth-ynxuvcit03q.ws-us104.gitpod.io/jira/auth/callback";

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const client_id = "ityYRiXjJgzXFS0StC8UNmAVLnIYT7cG";
const client_secret = "ATOA6E6gsl6rkckfSbkhvpEfM1qx94keupJkWhcChUUgqBfEHbBpD6tssl07gEUp0iPK5108C1BB";

// app.get("/jira/auth", async (req, res) => {
//   const redirectUrl = await url.create({
//     url: "https://auth.atlassian.com/authorize",
//     params: [
//       { key: "audience", value: "api.atlassian.com" },
//       { key: "client_id", value: client_id },
//       {
//         key: "scope",
//         value: [
//           "offline_access",
//           "read:jira-work",
//           "read:jira-user",
//           "manage:jira-configuration",
//           "write:jira-work",
//           "manage:jira-webhook",
//           "manage:jira-data-provider",
//           "manage:jira-project",
//         ].join(" "),
//       },
//       {
//         key: "redirect_uri",
//         value: serverUrl,
//       },
//       { key: "response_type", value: "code" },
//       { key: "prompt", value: "consent" },
//     ],
//   });

//   res.send({ url: redirectUrl });
// });

// app.get("/jira/auth/callback", async (req, res) => {
//   const code = req.query.code;

//   const response = await axios.post("https://auth.atlassian.com/oauth/token", {
//     grant_type: "authorization_code",
//     client_id,
//     client_secret,
//     code: code,
//     redirect_uri: serverUrl,
//   });

//   //   console.log(response);

//   fs.writeFileSync("credentials.json", JSON.stringify(response.data));
//   res.send("Thankyou!!!");
// });

// app.get("/jira/refresh_token", async (req, res) => {
//   const response = await axios.post("https://auth.atlassian.com/oauth/token", {
//     grant_type: "refresh_token",
//     client_id,
//     client_secret,
//     refresh_token: cred.refresh_token,
//     redirect_uri: serverUrl,
//   });

//   fs.writeFileSync("credentials.json", JSON.stringify(response.data));
//   res.send(response.data);
// });

// app.get("/jira/info", async (req, res) => {
//   const response = await axios({
//     method: "get",
//     url: "https://api.atlassian.com/oauth/token/accessible-resources",
//     headers: {
//       Authorization: `Bearer ${cred.access_token}`,
//       Accept: "application/json",
//     },
//   });

//   fs.writeFileSync("info.json", JSON.stringify(response.data));
//   res.end();
// });

app.all("/webhook", (req, res) => {
  fs.writeFileSync("Webhook.json", JSON.stringify(req.body));
  res.end();
});

app.listen(3333);
