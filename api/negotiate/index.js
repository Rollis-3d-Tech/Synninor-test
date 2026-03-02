const { WebPubSubServiceClient } = require("@azure/web-pubsub");

module.exports = async function (context, req) {
  try {
    const connectionString = process.env.WebPubSubConnectionString;
    const hubName = "prikkhub";  // ← ditt hub-navn fra tidligere

    if (!connectionString) {
      context.res = {
        status: 500,
        body: { error: "Manglende WebPubSubConnectionString i innstillinger" }
      };
      return;
    }

    const serviceClient = new WebPubSubServiceClient(connectionString, hubName);

    const token = await serviceClient.getClientAccessToken({
      userId: req.query.userId || "anonymous",  // valgfritt – kan utvides med auth
      roles: ["webpubsub.joinLeaveGroup", "webpubsub.sendToGroup"]
    });

    context.res = {
      status: 200,
      body: { url: token.url }
    };
  } catch (err) {
    context.res = {
      status: 500,
      body: { error: err.message || "Feil ved generering av token" }
    };
  }
};
