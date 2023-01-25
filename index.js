const express = require("express");
const fs = require("fs");
const axios = require("axios");
const url = require("url-generator");
const app = express();

const cred = require("./credentials.json");

const serverUrl = "https://3010-14-140-115-103.in.ngrok.io";

app.get("/jira/auth", async (req, res) => {
  const redirectUrl = await url.create({
    url: "https://auth.atlassian.com/authorize",
    params: [
      { key: "audience", value: "api.atlassian.com" },
      { key: "client_id", value: "Byws3TO2dp8l7S1SSnyar1GEUHW9wUBz" },
      {
        key: "scope",
        value: [
          "offline_access",
          "read:jira-work",
          "read:jira-user",
          "manage:jira-configuration",
          "write:jira-work",
          "manage:jira-webhook",
          "manage:jira-data-provider",
          "manage:jira-project",
        ].join(" "),
      },
      {
        key: "redirect_uri",
        value: `${serverUrl}/jira/auth/callback`,
      },
      { key: "response_type", value: "code" },
      { key: "prompt", value: "consent" },
    ],
  });

  res.send({ url: redirectUrl });
});

app.get("/jira/auth/callback", async (req, res) => {
  const code = req.query.code;

  const response = await axios.post("https://auth.atlassian.com/oauth/token", {
    grant_type: "authorization_code",
    client_id: "Byws3TO2dp8l7S1SSnyar1GEUHW9wUBz",
    client_secret:
      "ATOAtN35HXuWd8hblsXyKgsRRQ26vfrJ5NI-ttW5By_ZASRVZlAFKN1gz0NuOUoD-6IK43990AEB",
    code: code,
    redirect_uri: `${serverUrl}/jira/auth/callback`,
  });

  //   console.log(response);

  fs.writeFileSync("credentials.json", JSON.stringify(response.data));
  res.send("Thankyou!!!");
});

app.get("/jira/refresh_token", async (req, res) => {
  const response = await axios.post("https://auth.atlassian.com/oauth/token", {
    grant_type: "refresh_token",
    client_id: "Byws3TO2dp8l7S1SSnyar1GEUHW9wUBz",
    client_secret:
      "ATOAtN35HXuWd8hblsXyKgsRRQ26vfrJ5NI-ttW5By_ZASRVZlAFKN1gz0NuOUoD-6IK43990AEB",
    refresh_token: cred.refresh_token,
    redirect_uri: `${serverUrl}/jira/auth/callback`,
  });

  fs.writeFileSync("credentials.json", JSON.stringify(response.data));
  res.send(response.data);
});

app.get("/jira/info", async (req, res) => {
  const response = await axios({
    method: "get",
    url: "https://api.atlassian.com/oauth/token/accessible-resources",
    headers: {
      Authorization: `Bearer ${cred.access_token}`,
      Accept: "application/json",
    },
  });

  fs.writeFileSync("info.json", JSON.stringify(response.data));
  res.end();
});

app.all("/webhook", (req, res) => {
  console.log(req);
  fs.writeFileSync("Webhook.json", req.body);
  res.end();
});

app.listen(3333);
