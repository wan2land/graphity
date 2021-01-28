<template>
  <section class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <input class="new-todo" placeholder="What needs to be done?" autofocus v-model="inputCreateTodo" @keyup.enter="createTodo">
    </header>
		<section class="main" v-if="todos.length">
			<input class="toggle-all" id="toggle-all" type="checkbox" :checked="allCompleted" @input="toggleAllCompleteTodo">
			<label for="toggle-all">Mark all as complete</label>
			<ul class="todo-list">
        <li v-for="(todo, todoIndex) in filteredTodos" :class="{'completed': todo.completed, 'editing': todo.id === editedTodoId}" :key="todoIndex">
          <div class="view">
            <input class="toggle" type="checkbox" :checked="todo.completed" @input="toggleCompleteTodo(todo, $event)">
            <label @dblclick="editTodo(todo)">{{ todo.title }}</label>
            <button class="destroy" @click="deleteTodo(todo)"></button>
          </div>
          <input class="edit" type="text" v-model="inputEditTodo" v-todo-focus="todo.id == editedTodoId" @blur="cancelEdit(todo)" @keyup.enter="saveEdit(todo)" @keyup.esc="cancelEdit(todo)">
        </li>
			</ul>
		</section>
    <footer class="footer" v-if="todos.length">
      <span class="todo-count"><strong>{{ remaining }}</strong> item<span v-if="remaining > 1">s</span> left</span>
      <ul class="filters">
        <li>
          <nuxt-link :to="{ query: {} }" exact>All</nuxt-link>
        </li>
        <li>
          <nuxt-link :to="{ query: { status: 'active' } }">Active</nuxt-link>
        </li>
        <li>
          <nuxt-link :to="{ query: { status: 'completed' } }">Completed</nuxt-link>
        </li>
      </ul>
      <button class="clear-completed" @click="deleteComplete" v-if="todos.length > remaining">
        Clear completed
      </button>
    </footer>
	</section>
</template>
<script>
import QueryTodos from '~/gql/QueryTodos.gql'
import CreateTodo from '~/gql/CreateTodo.gql'
import DeleteTodo from '~/gql/DeleteTodo.gql'
import DeleteTodos from '~/gql/DeleteTodos.gql'
import UpdateTodo from '~/gql/UpdateTodo.gql'
import CompleteTodos from '~/gql/CompleteTodos.gql'
import UncompleteTodos from '~/gql/UncompleteTodos.gql'


export default {
  async asyncData({ app: { apolloProvider: { defaultClient } } }) {
    const data = await defaultClient.query({
      fetchPolicy: 'no-cache',
      query: QueryTodos,
    }).then(({ data }) => data)
    return {
      ...data,
    }
  },
  data () {
    return {
      editedTodoId: null,
      inputCreateTodo: null,
      inputEditTodo: null,
    }
  },
  directives: {
    'todo-focus' (el, binding) {
      if (binding.value) {
        el.focus()
      }
    }
  },
  computed: {
    allCompleted() {
      for (const todo of this.filteredTodos) {
        if (!todo.completed) {
          return false
        }
      }
      return true
    },
    filteredTodos () {
      if (this.$route.query.status === 'active') {
        return this.todos.filter(todo => !todo.completed)
      }
      if (this.$route.query.status === 'completed') {
        return this.todos.filter(todo => todo.completed)
      }
      return this.todos
    },
    remaining () {
      return this.todos.filter(todo => !todo.completed).length
    },
  },
  methods: {
    editTodo(todo) {
      this.editedTodoId = todo.id
      this.inputEditTodo = todo.title
    },
    saveEdit(todo) {
      const title = this.inputEditTodo && this.inputEditTodo.trim()
      if (!title) {
        return
      }
      return this.updateTodo({ id: todo.id, title, completed: todo.completed }).then(() => {
        this.inputEditTodo = null
        this.editedTodoId = null
      })
    },
    toggleCompleteTodo(todo, event) {
      const completed = event.target.checked
      return this.updateTodo({ id: todo.id, title: todo.title, completed })
    },
    cancelEdit(todo) {
      this.editedTodoId = null
      this.inputEditTodo = null
    },
    async createTodo () {
      const value = this.inputCreateTodo && this.inputCreateTodo.trim()
      if (!value) {
        return
      }
      const { todo } = await this.$apollo.mutate({
        mutation: CreateTodo,
        variables: {
          input: {
            title: value,
          },
        },
      }).then(({ data }) => data)
      this.todos.unshift(todo)
      this.inputCreateTodo = null
    },
    async updateTodo(todo) {
      const { todo: updatedTodo } = await this.$apollo.mutate({
        mutation: UpdateTodo,
        variables: {
          id: todo.id,
          input: {
            title: todo.title,
            completed: todo.completed,
          },
        },
      }).then(({ data }) => data)
      const updatedTodoIndex = this.todos.findIndex(todo => todo.id === updatedTodo.id)
      if (updatedTodoIndex > -1) {
        Object.assign(this.todos[updatedTodoIndex], updatedTodo)
      }
    },
    async toggleAllCompleteTodo(event) {
      let updatedTodos = []
      if (event.target.checked) {
        const { todos } = await this.$apollo.mutate({
          mutation: CompleteTodos,
          variables: {
            ids: this.todos.filter(({ completed }) => !completed).map(({ id }) => id),
          },
        }).then(({ data }) => data)
        updatedTodos = todos
      } else {
        const { todos } = await this.$apollo.mutate({
          mutation: UncompleteTodos,
          variables: {
            ids: this.todos.filter(({ completed }) => completed).map(({ id }) => id),
          },
        }).then(({ data }) => data)
        updatedTodos = todos
      }
      for (const updatedTodo of updatedTodos) {
        const updatedTodoIndex = this.todos.findIndex(todo => todo.id === updatedTodo.id)
        if (updatedTodoIndex > -1) {
          Object.assign(this.todos[updatedTodoIndex], updatedTodo)
        }
      }
    },
    async deleteTodo(todo) {
      const { todo: deletedTodo } = await this.$apollo.mutate({
        mutation: DeleteTodo,
        variables: {
          id: todo.id,
        },
      }).then(({ data }) => data)
      const deletedTodoIndex = this.todos.findIndex(todo => todo.id === deletedTodo.id)
      if (deletedTodoIndex > -1) {
        this.todos.splice(deletedTodoIndex, 1)
      }
    },
    async deleteComplete () {
      const { todos: deletedTodos } = await this.$apollo.mutate({
        mutation: DeleteTodos,
        variables: {
          ids: this.todos.filter(({ completed }) => completed).map(({ id }) => id),
        },
      }).then(({ data }) => data)
      for (const deletedTodo of deletedTodos) {
        const deletedTodoIndex = this.todos.findIndex(todo => todo.id === deletedTodo.id)
        if (deletedTodoIndex > -1) {
          this.todos.splice(deletedTodoIndex, 1)
        }
      }
    },
  }
}
</script>
