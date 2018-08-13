module.exports = function (io) {
    var redis = require('redis')
    var express = require('express');
    var router = express.Router();
    router.get('/', function(req, res, next) {
        res.render('index', { title: 'Express' });
    });
    var redisClient = redis.createClient();
    io.on('connection',function (socket) {
        redisClient.subscribe('message');
        redisClient.on("message", function(channel, message) {

            message = JSON.parse(message)

            if(message.login != undefined)
            {
              console.log('dang gui logout')
                socket.emit('login-' + message.login.id,true)
            }
            else if(message.event != undefined){
                console.log('dang gui event')
                if(message.event.listId != undefined)
                {
                  let listId = message.event.listId

                    if(typeof listId == 'object') {
                        if (listId.length > 0)
                        {
                          listId.forEach(item => {
                              socket.emit('event-' + item,message.event)
                          })
                        }
                    }


                }
            }
            else if(message.reg_event != undefined){
              console.log('thong bao nhan event')
                if (message.reg_event.id != undefined)
                {
                    socket.emit('reg-event-' + message.reg_event.id,true)
                }
            }
            else if(message.un_reg_event != undefined){
                console.log('thong bao huy nhan event')
                if (message.un_reg_event.id != undefined)
                {
                    socket.emit('un-reg-event-' + message.un_reg_event.id,true)
                }
            }
        });
    })
    return  router;
}

