/**
 * 用户相关路由
 */
const express = require('express');

var book = express.Router();

book.get('/', function(req, res) {
  res.send('this is router--/book result');
})

book.get('/books', function(req, res) {
  var books = [
    { name: '圣墟', author: '辰东' },
    { name: '盘龙', author: '我吃西红柿' },
    { name: '将夜', author: '猫腻' }
  ];

  var html = '<ul>'+
                books.map(function(book) {
                  return '<li>' + book.name + '-' + book.author + '</li>';
                }).join('')
            +'</ul>';

  res.send(html)
})

module.exports = book;
