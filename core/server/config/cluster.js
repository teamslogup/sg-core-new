var cluster = require('cluster'),
    os = require('os');

var config = require('../../../bridge/config/env');
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var workers = []; // que of running workers
var restartWorkers = []; // que of restart workers

var TIMEOUT = 120 * 1000; // 2 minutes
var timeout;

function inItWorker (worker) {
    worker.on("message", function (msg) {
        if (msg.cmd && msg.cmd == "workerStart") {
            console.log("(pid: " + msg.pid + ") Server running at " + config.app.port + " " + env + " mode. logging: " + config.db.logging);
            if (restartWorkers.length > 0) {
                if (restartWorkers.length == workers.length) {
                    restartWorkers = [];
                } else {
                    restartWorker(workers[0]);
                }
            }
        } else if (msg.cmd && msg.cmd == "workerClose") {
            console.log("(pid: " + msg.pid + ") Server close");
        } else if (msg.cmd && msg.cmd == "workerRestart") {
            console.log("(pid: " + msg.pid + ") Server restart");
        } else if (msg.cmd && msg.cmd == "restart") {
            restartWorker(workers[0]);
        } else if (msg.cmd && msg.cmd == "close") {
            closeWorker(workers[0]);
        }
    });

    worker.on("disconnect", function () {
        clearTimeout(timeout);
    });
    return worker;
}

function restartWorker (worker) {
    worker.send({cmd: "restart"});
    worker.disconnect();
    timeout = setTimeout(worker.kill, TIMEOUT);
}

function closeWorker (worker) {
    worker.send({cmd: "close"});
    worker.disconnect();
    timeout = setTimeout(worker.kill, TIMEOUT);
}

function gracefulCloseServer (server, app, code) {
    server.close(function () {
        console.log("exit worker with code: ", code);
        process.exit(code);
    });

    setTimeout(function () {
        console.log("forcefully exit worker with code: ", code);
        process.exit(code);
    }, TIMEOUT);
}

module.exports = {
    startCluster: function (argServer) {
        var app = argServer;
        cluster.schedulingPolicy = cluster.SCHED_RR;
        
        if (cluster.isMaster) {
            workers = [];
            
            os.cpus().forEach(function (cpu) {
                workers.push(inItWorker(cluster.fork()));
            });
    
            cluster.on("exit", function (worker, code, signal) {
                console.log("exit worker pid : " + worker.process.pid);
                console.log("exit worker code : " + code);
                console.log("exit worker signal : " + signal);

                workers.splice(workers.indexOf(worker), 1);
                if (code == 200) {
                    restartWorkers.push(worker);
                    workers.push(inItWorker(cluster.fork()));
                } else if (code == 100) {
                    if (workers.length > 0) closeWorker(workers[0]);
                }
                
            });

        } else if (cluster.isWorker) {
            var server = app.listen(config.app.port);

            process.send({cmd: "workerStart", pid: cluster.worker.process.pid});

            process.on("message", function (msg) {
                if (msg.cmd && msg.cmd == "close") {
                    process.send({cmd: "workerClose", pid: cluster.worker.process.pid});

                    // initiate graceful close
                    gracefulCloseServer(server, app, 100);
                } else if (msg.cmd && msg.cmd == "restart") {
                    process.send({cmd: "workerRestart", pid: cluster.worker.process.pid});

                    // initiate graceful close
                    gracefulCloseServer(server, app, 200);
                }
            });
        } else {
            console.log("start cluster error...")
        }
    },
    closeCluster: function () {
        if (cluster.isMaster) {
            closeWorker(workers[0]);
        } else if (cluster.isWorker) {
            process.send({cmd: "close"});
        } else {
            console.log("close cluster error...");
        }
    },
    restartCluster: function () {
        if (cluster.isMaster) {
            restartWorker(workers[0]);
        } else if (cluster.isWorker) {
            process.send({cmd: "restart"});
        } else {
            console.log("restart cluster error...");
        }
    }
};