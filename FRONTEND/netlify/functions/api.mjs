import serverless from "serverless-http";

// Import modules directly from BACKEND node_modules so esbuild resolves them to the same instance
// that BACKEND's app.js will use. We use default imports.
import cron from "../../../BACKEND/node_modules/node-cron/dist/cjs/node-cron.js";
import mongoose from "../../../BACKEND/node_modules/mongoose/index.js";

// Patch node-cron synchronously
const cronDefault = cron.default || cron;
cronDefault.schedule = () => { console.log("node-cron schedule bypassed in serverless"); };

// Patch mongoose synchronously
const mongooseDefault = mongoose.default || mongoose;
const originalConnect = mongooseDefault.connect;
let isConnected = false;
mongooseDefault.connect = async function (uri, options) {
  if (isConnected || mongooseDefault.connection.readyState >= 1) return Promise.resolve();
  isConnected = true;
  return originalConnect.call(this, uri || process.env.MONGO_URL, options);
};

// Import app dynamically without top-level await!
// This starts loading app.js immediately, but since it's asynchronous,
// it happens AFTER the synchronous patches above.
const appPromise = import("../../../BACKEND/app.js").then(m => m.app);

let serverlessHandler;

export const handler = async (event, context) => {
  if (!serverlessHandler) {
    const app = await appPromise;
    serverlessHandler = serverless(app, { basePath: '/.netlify/functions/api' });
  }
  return serverlessHandler(event, context);
};
