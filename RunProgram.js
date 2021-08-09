const shell = require('shelljs');
//const cron = require('node-cron');
shell.exec('./RUNPY.sh')
setInterval(function() {
    console.log("rerunningKDLAJFALSKFJLKASFJ")
    shell.exec('./RUNPY.sh');
}, 1000 * 60 * 60 * 6);

/*cron.schedule('* *\/6 * * *', () => {
    shell.exec('./RUNPY.sh');
});
*/
