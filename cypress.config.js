const { defineConfig } = require('cypress');
const mysql = require('mysql');
const reportDir = process.env.REPORT_DIR || 'cypress/reports';
const reportName = process.env.REPORT_NAME || 'TestReport';

module.exports = defineConfig({
  projectId: "kveppv",
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: `${reportDir}/${reportName}`,         // Custom report path
    overwrite: false,
    html: true,
    json: true,
    embeddedScreenshots: true,
    inlineAssets: true,
    quiet: true
  },
  e2e: {
    setupNodeEvents(on, config) {
      // Register mochawesome reporter plugin
      require('cypress-mochawesome-reporter/plugin')(on);

      // DB task
      on('task', {
        queryDb: query => queryTestDb(query, config),
      });

      return config;
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,ts}',
    supportFile: 'cypress/support/e2e.js',
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    video: true
  },
  env: {
    db: {
      host: "db4free.net",
      user: "mobilestoreuser",
      password: "mobilestoreuser",
      database: "mymobilestore"
    }
  }
});

function queryTestDb(query, config) {
  const connection = mysql.createConnection(config.env.db);
  connection.connect();

  return new Promise((resolve, reject) => {
    connection.query(query, (error, results) => {
      if (error) reject(error);
      else {
        connection.end();
        return resolve(results);
      }
    });
  });
}
