"use strict";

const Path = require("path");

const Handlebars = require("handlebars");
const Hapi = require("hapi");
const Vision = require("vision");

const internals = {
  templatePath: "withLayout",
  thisYear: new Date().getFullYear()
};

internals.rootHandler = function(request, h) {
  const relativePath = Path.relative(
    `${__dirname}/../..`,
    `${__dirname}/templates/${internals.templatePath}`
  );

  return h.view("index", {
    title: `Running ${relativePath} | hapi ${request.server.version}`,
    message: "Hello Handlebars Layout!",
    year: internals.thisYear
  });
};

internals.main = async function() {
  const server = Hapi.Server({ port: 3000 });

  await server.register(Vision);

  server.views({
    engines: { html: Handlebars },
    relativeTo: __dirname,
    path: "templates/withLayout",
    layout: true,
    layoutPath: "templates/withLayout/layouts"
  });

  server.route({ method: "GET", path: "/", handler: internals.rootHandler });

  await server.start();
  console.log("Server is running at " + server.info.uri);
};

internals.main();
