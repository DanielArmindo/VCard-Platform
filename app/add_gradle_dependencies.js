var fs = require('fs');
var path = require('path');

module.exports = function (context) {
    var gradlePath = path.join(context.opts.projectRoot, 'platforms', 'android', 'app', 'build.gradle');
    var gradleContent = fs.readFileSync(gradlePath, 'utf-8');

    if (!gradleContent.includes("io.socket:socket.io-client:2.1.0")) {
        var dependenciesIndex = gradleContent.indexOf('dependencies {');
        var updatedGradleContent = [gradleContent.slice(0, dependenciesIndex), '    implementation (\'io.socket:socket.io-client:2.1.0\') {\n        exclude group: \'org.json\', module: \'json\'\n    }\n', gradleContent.slice(dependenciesIndex)].join('');
        fs.writeFileSync(gradlePath, updatedGradleContent, 'utf-8');
    }
};