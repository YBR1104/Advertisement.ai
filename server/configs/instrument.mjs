import * as Sentry from "@sentry/node"


Sentry.init({
  dsn: "https://4ab836434756fece02f9d4961465d975@o4511058806243328.ingest.us.sentry.io/4511058816925696",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});