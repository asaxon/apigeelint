/*
  Copyright 2019 Google LLC

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      https://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

var assert = require("assert"),
  debug = require("debug")("bundlelinter"),
  Bundle = require("../../lib/package/Bundle.js"),
  bl = require("../../lib/package/bundleLinter.js");

debug("test configuration: " + JSON.stringify(configuration));
var bundle = new Bundle(configuration);
bl.executePlugin("checkUnattachedPolicies.js", bundle, function() {
  describe("Check for unattached policies in " + bundle.root, function() {
    bundle.getReport(function(report) {
      var unattachedFiles = [
        "ExtractVariables.xml",
        "ExtractVariables_1.xml",
        "ExtractVariables_unattached.xml",
        "badServiceCallout.xml",
        "jsCalculate.xml"
      ];

      for (var j = 0; j < unattachedFiles.length; j++) {
        var file = unattachedFiles[j];
        it(
          "should mark " +
            file +
            " as unattached in report ",
          function() {
            var found = false;
            for (var i = 0; i < report.length && !found; i++) {
              var reportObj = report[i];
              if (reportObj.filePath.endsWith(file)) {
                reportObj.messages.forEach(function(msg) {
                  if (msg.ruleId === "BN005") {
                    found = true;
                  }
                });
              }
            }
            assert.equal(found, true);
          }
        );
      }
    });
  });
});
