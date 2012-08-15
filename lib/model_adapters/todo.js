var Todo = new (function () {
  this.all = function (callback) {
    callback(null, geddy.todos);
  };
  
  this.save = function (todo, opts, callback) {
    if (typeof callback != 'function') {
      callback = function(){};
    }

    todo.saved = true;
    geddy.todos.push(todo);
    return callback(null, todo);
  };
})();
exports.Todo = Todo;