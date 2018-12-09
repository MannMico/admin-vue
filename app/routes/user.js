/**
 * 用户相关路由
 */
const express = require('express');

var user = express.Router();

user.get('/', function(req, res) {
  res.send('this is router--/user result');
})

user.get('/users', function(req, res) {
  var users = [
    { name: 'xiaoming', phone: 1510176731 },
    { name: 'xiaohong', phone: 1510176732 },
    { name: 'xiaobai', phone: 1510176733 }
  ];

  var html = '<ul>'+
                users.map(function(user) {
                  return '<li>' + user.name + '-' + user.phone + '</li>';
                }).join('')
            +'</ul>';

  res.send(html)
})

module.exports = user;
