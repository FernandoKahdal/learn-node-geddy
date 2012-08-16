var Todo = new (function () {
  
  this.all = function (callback) {
    var todos = [];
    geddy.db.todos.find().sort({status: -1, title: 1}).toArray(function(err, docs) {
      if(err) {
        return callback(err, null);
      }
      for (var i in docs) {
        todos.push(geddy.model.Todo.create(docs[i]));
      }
      return callback(null, todos);
    });
  };

  this.load = function (id, callback) {
    var todo;
    // find a todo in the db
    geddy.db.todos.findOne({id: id}, function(err, doc) {
      if (err) {
        return callback(err, null);
      }
      // if there's a doc, create a model out of it
      if (doc) {
        todo = geddy.model.Todo.create(doc);
      }
      return callback(null, todo);
    });
  };

  // the save method accounts for both new todos and updating old todos
  this.save = function (todo, opts, callback) {

    if (typeof callback != 'function') {
      callback = function(){};
    }

    cleanTodo = {
      id: todo.id,
      saved: todo.saved,
      title: todo.title,
      status: todo.status
    };

    // double check to see if the todo is valid
    todo = geddy.model.Todo.create(cleanTodo);
    if(!todo.isValid()) {
      return callback(todo.errors, null);
    }

    //check to see if the todo item already exists
    geddy.db.todos.findOne({id: todo.id}, function(err, doc) {
      if(err) {
        return callback(err, null);
      }
      //if it already exists, update it with the new valeus
      if(doc) {
        geddy.db.todos.update({id: todo.id}, cleanTodo, function(err, docs) {
          return callback(todo.errors, todo);
        });
      } else {
        todo.saved = true;
        geddy.db.todos.save(todo, function(err, docs) {
          return callback(err, docs);
        });
      }
    });

  };

  this.remove = function (id, callback) {
    if (typeof callback != 'function') {
      callback = function(){};
    }

    geddy.db.todos.remove({id: id}, function(err, res) {
      callback(err);
    });
  };

})();
exports.Todo = Todo;