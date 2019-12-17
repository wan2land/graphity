"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TodoResolver = void 0;

var _types = require("@graphity-extensions/types");

var _graphity = require("graphity");

var _graphql = require("graphql");

var _todo = require("../entities/todo");

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _class, _class2, _temp;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

let increment = 1;
let TodoResolver = (_dec = (0, _graphity.GraphQLResolver)(type => _todo.Todo), _dec2 = (0, _graphity.Query)({
  returns: node => (0, _types.GraphQLNonNullList)(node)
}), _dec3 = (0, _graphity.Query)({
  input: {
    id: {
      type: _graphql.GraphQLID
    }
  }
}), _dec4 = (0, _graphity.Mutation)({
  input: {
    input: {
      type: new _graphql.GraphQLInputObjectType({
        name: 'InputCreateTodo',
        fields: {
          contents: {
            type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString)
          }
        }
      })
    }
  }
}), _dec5 = (0, _graphity.Mutation)({
  input: {
    id: {
      type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLID)
    },
    input: {
      type: new _graphql.GraphQLInputObjectType({
        name: 'InputUpdateTodo',
        fields: {
          contents: {
            type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLString)
          }
        }
      })
    }
  }
}), _dec6 = (0, _graphity.Mutation)({
  description: 'change \'isDone\' to true',
  input: {
    id: {
      type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLID)
    }
  }
}), _dec7 = (0, _graphity.Mutation)({
  description: 'change \'isDone\' to false',
  input: {
    id: {
      type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLID)
    }
  }
}), _dec8 = (0, _graphity.Mutation)({
  input: {
    id: {
      type: (0, _graphql.GraphQLNonNull)(_graphql.GraphQLID)
    }
  }
}), _dec(_class = (_class2 = (_temp = class TodoResolver {
  constructor() {
    _defineProperty(this, "nodes", []);
  }

  todos() {
    return this.nodes;
  }

  todo(_, params) {
    return this.nodes.find(({
      id
    }) => id === params.id);
  }

  createTodo(_, params) {
    const id = increment++;
    const node = Object.assign(new _todo.Todo(), {
      id: `${id}`,
      contents: params.input.contents,
      isDone: false
    });
    this.nodes.push(node);
    return node;
  }

  updateTodo(_, params) {
    const node = this.nodes.find(({
      id
    }) => id === params.id);

    if (!node) {
      return null;
    }

    return Object.assign(node, params.input);
  }

  doneTodo(_, input) {
    const node = this.nodes.find(({
      id
    }) => id === input.id);

    if (!node) {
      return null;
    }

    return Object.assign(node, {
      isDone: true
    });
  }

  undoneTodo(_, params) {
    const node = this.nodes.find(({
      id
    }) => id === params.id);

    if (!node) {
      return null;
    }

    return Object.assign(node, {
      isDone: false
    });
  }

  deleteTodo(_, input) {
    const node = this.nodes.find(({
      id
    }) => id === input.id);

    if (!node) {
      return null;
    }

    this.nodes.splice(this.nodes.indexOf(node), 1);
    return node;
  }

}, _temp), (_applyDecoratedDescriptor(_class2.prototype, "todos", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "todos"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "todo", [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "todo"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "createTodo", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "createTodo"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "updateTodo", [_dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "updateTodo"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "doneTodo", [_dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "doneTodo"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "undoneTodo", [_dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "undoneTodo"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "deleteTodo", [_dec8], Object.getOwnPropertyDescriptor(_class2.prototype, "deleteTodo"), _class2.prototype)), _class2)) || _class);
exports.TodoResolver = TodoResolver;