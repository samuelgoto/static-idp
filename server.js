const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const { Parser } = require("htmlparser2");
var querystring = require("querystring");
const session = require("express-session");

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/.well-known/web-identity", async (req, res) => {
  res.type("json");
  res.send({
    provider_urls: ["/fedcm.json"],
  });
});

app.use("/fedcm.json", async function (req, res, next) {
  res.type("json");
  res.send({
    accounts_endpoint: "/accounts",
    id_token_endpoint: "/idtoken_endpoint.json",
    client_metadata_endpoint: "/client_metadata",
    id_assertion_endpoint: "/id_assertion_endpoint",
    revocation_endpoint: "/revoke_endpoint.json",
    metrics_endpoint: "/metrics_endpoint.json",
    login_url: "/",
    // types: ["indieauth"],
    branding: {
	     background_color: "green",
	     color: "#FFEEAA",
	     icons: [{
        url:  "https://static.thenounproject.com/png/362206-200.png",
	     }],
    },
  });
});

function error(res, message) {
  return res.status(400).end();
}

app.use("/accounts", (req, res) => {
  res.type("json");
  res.send({
    accounts: [{
      id: "1234",
      account_id: "1234",
      email: "user@email.com",
      name: "John Doe",
      given_name: "John",
      picture: "https://pbs.twimg.com/profile_images/920758039325564928/vp0Px4kC_400x400.jpg",
    },],
  });
});

app.use("/client_metadata", (req, res) => {
  // Check for the CORS headers
  res.type("json");
  res.send({
    privacy_policy_url: "https://rp.example/privacy_policy.html",
    terms_of_service_url: "https://rp.example/terms_of_service.html",
  });
});

const tokens = {};

app.post("/id_assertion_endpoint", (req, res) => {
  res.type("json");
  res.set("Access-Control-Allow-Origin", req.headers.origin);
  res.set("Access-Control-Allow-Credentials", "true");
  
  res.json({
    token: JSON.stringify({
      hello: "world",
    }),
  });
});

app.use(express.static("public"));

app.get("/", async (req, res) => {
  res.send(`
    This is the absolutely simplest FedCM IdP Implementation.
  `);
});

const listener = app.listen(process.env.PORT || 8080, async () => {
  console.log("Your app is listening on port " + listener.address().port);
});

