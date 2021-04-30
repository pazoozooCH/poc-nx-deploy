module.exports = async function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request, instance 2...');

  if (req.query.name || (req.body && req.body.name)) {
      context.res = {
          // status: 200, /* Defaults to 200 */
          body: "Hello2 from Node.js, version 2 " + (req.query.name || req.body.name) + `, it's ${new Date()}`
      };
  }
  else {
      context.res = {
          status: 400,
          body: "Please pass a name on the query string or in the request body"
      };
  }
};
