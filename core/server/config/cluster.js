var cluster = require('cluster'),
    os = require('os'),
    async = require('async');

var config = require('../../../bridge/config/env');
var express = require('../../../bridge/config/express');
var https = require('../../../core/server/config/https');
var sequelize = require('../../../core/server/config/sequelize');
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var workers = [];
var restartWorkers = [];

function inItWorker (worker) {
    worker.on("message", function (msg) {
        if (msg.type && msg.type == "workerStart") {
            console.log("(pid: " + msg.pid + ") Server running at " + config.app.port + " " + env + " mode. logging: " + config.db.logging);
            if (restartWorkers.length > 0) {
                if (restartWorkers.length == workers.length) {
                    restartWorkers = [];
                } else {
                    workers[0].send({type: "restart"});
                }
            }
        } else if (msg.type && msg.type == "workerClose") {
            console.log("(pid: " + msg.pid + ") Server close");
        } else if (msg.type && msg.type == "workerRestart") {
            console.log("(pid: " + msg.pid + ") Server restart");
        } else if (msg.type && msg.type == "restart") {
            workers[0].send({type: "restart"});
        } else if (msg.type && msg.type == "close") {
            workers[0].send({type: "close"});
        }
    });
    return worker;
}

module.exports = {
    startCluster: function (server) {
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
                    if (workers.length > 0) workers[0].send({type: "close"});
                }
                
            });

        } else if (cluster.isWorker) {
            server.listen(config.app.port);
            process.send({type: "workerStart", pid: cluster.worker.process.pid});

            process.on("message", function (msg) {
                if (msg.type && msg.type == "close") {
                    // initiate graceful close
                    process.send({type: "workerClose", pid: cluster.worker.process.pid});
                    process.exit(100);
                } else if (msg.type && msg.type == "restart") {
                    // initiate graceful close
                    process.send({type: "workerRestart", pid: cluster.worker.process.pid});
                    process.exit(200);
                }
            });
        } else {
            console.log("start cluster error...")
        }
    },
    closeCluster: function () {
        if (cluster.isMaster) {
            workers[0].send({type: "close"});
        } else if (cluster.isWorker) {
            process.send({type: "close"});
        } else {
            console.log("close cluster error...");
        }
    },
    restartCluster: function () {
        if (cluster.isMaster) {
            workers[0].send({type: "restart"});
        } else if (cluster.isWorker) {
            process.send({type: "restart"});
        } else {
            console.log("restart cluster error...");
        }
    }
};