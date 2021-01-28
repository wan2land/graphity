<style scoped>
.signin {
  padding: 1rem;
}
.signin button {
  font-size: 1rem;
  display: flex;
  margin-left: auto;
  margin-right: auto;
  align-items: center;
  cursor: pointer;
}
.signin button span {
  margin-left: .5em;
}
.signout {
  position: absolute;
  cursor: pointer;
  top: 0;
  right: 0;
  padding: 20px 14px 18px 8px;
}
.signout svg {
  fill: #4d4d4d;
}
</style>
<template>
  <section class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <template v-if="isSignedIn">
        <input class="new-todo" placeholder="What needs to be done?" autofocus v-model="inputCreateTodo" @keyup.enter="createTodo">
        <button @click="signout" class="signout">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M11.594,22.625l-6.26,-0c-1.701,-0 -3.082,-1.386 -3.082,-3.082l0,-15.086c0,-1.701 1.386,-3.082 3.082,-3.082l6.362,0c0.382,0 0.688,-0.305 0.688,-0.687c-0,-0.382 -0.306,-0.688 -0.688,-0.688l-6.362,0c-2.46,0 -4.457,2.002 -4.457,4.457l0,15.086c0,2.46 2.002,4.457 4.457,4.457l6.26,0c0.382,0 0.688,-0.306 0.688,-0.688c0,-0.382 -0.311,-0.687 -0.688,-0.687Zm11.329,-11.109l-4.37,-4.37c-0.27,-0.27 -0.703,-0.27 -0.973,0c-0.27,0.27 -0.27,0.703 -0,0.973l3.199,3.198l-13.952,0c-0.382,0 -0.688,0.306 -0.688,0.688c-0,0.382 0.306,0.688 0.688,0.688l13.952,-0l-3.199,3.198c-0.27,0.27 -0.27,0.703 -0,0.973c0.132,0.133 0.31,0.204 0.484,0.204c0.173,-0 0.351,-0.066 0.483,-0.204l4.371,-4.37c0.275,-0.275 0.275,-0.713 0.005,-0.978Z" />
          </svg>
        </button>
      </template>
      <template v-else>
        <div class="signin" v-if="!isSignedIn">
          <button @click="signin">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span>Sign In by Github</span>
          </button>
        </div>
      </template>
    </header>
    <template v-if="isSignedIn && todos.length > 0">
      <section class="main">
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
            <nuxt-link :to="{ query: {} }" :class="{ selected: !$route.query.status }">All</nuxt-link>
          </li>
          <li>
            <nuxt-link :to="{ query: { status: 'active' } }" :class="{ selected: $route.query.status === 'active' }">Active</nuxt-link>
          </li>
          <li>
            <nuxt-link :to="{ query: { status: 'completed' } }" :class="{ selected: $route.query.status === 'completed' }">Completed</nuxt-link>
          </li>
        </ul>
        <button class="clear-completed" @click="deleteComplete" v-if="todos.length > remaining">
          Clear completed
        </button>
      </footer>
    </template>
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
import SubscribeTodoCreated from '~/gql/SubscribeTodoCreated.gql'
import SubscribeTodosUpdated from '~/gql/SubscribeTodosUpdated.gql'
import SubscribeTodosDeleted from '~/gql/SubscribeTodosDeleted.gql'
import QueryGithubAuthRequestUri from '~/gql/QueryGithubAuthRequestUri.gql'


export default {
  async asyncData({ app: { apolloProvider: { defaultClient }, $apolloHelpers } }) {
    if (!$apolloHelpers.getToken()) {
      return {
        isSignedIn: false,
        todos: [],
      }
    }
    const data = await defaultClient.query({
      fetchPolicy: 'no-cache',
      query: QueryTodos,
    }).then(({ data }) => data)
    return {
      isSignedIn: true,
      ...data,
    }
  },
  data () {
    return {
      editedTodoId: null,
      inputCreateTodo: null,
      inputEditTodo: null,
      subTodoCreated: null,
      subTodosUpdated: null,
      subTodosDeleted: null,
    }
  },
  mounted() {
    if (this.isSignedIn) {
      this.subscribe()
    }
  },
  beforeDestroy() {
    this.unsubscribe()
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
    async signin() {
      const { requestUri } = await this.$apollo.query({
        fetchPolicy: 'no-cache',
        query: QueryGithubAuthRequestUri,
      }).then(({ data }) => data)
      location.href = requestUri
    },
    async signout() {
      this.unsubscribe()
      await this.$apolloHelpers.onLogout()
      this.isSignedIn = false
    },
    subscribe() {
      this.subTodoCreated = this.$apollo.subscribe({
        query: SubscribeTodoCreated,
      }).subscribe({
        next: async ({ data: { todo } }) => {
          this.todos.unshift(todo)
        },
        error: (error) => {
          console.log('on error in sub', error)
        },
      })
      this.subTodosUpdated = this.$apollo.subscribe({
        query: SubscribeTodosUpdated,
      }).subscribe({
        next: async ({ data: { todos } }) => {
          for (const todo of todos) {
            const todoIndex = this.todos.findIndex(({ id }) => id === todo.id)
            if (todoIndex > -1) {
              Object.assign(this.todos[todoIndex], todo)
            }
          }
        },
        error: (error) => {
          console.log('on error in sub', error)
        },
      })
      this.subTodosDeleted = this.$apollo.subscribe({
        query: SubscribeTodosDeleted,
      }).subscribe({
        next: async ({ data: { todos } }) => {
          for (const todo of todos) {
            const todoIndex = this.todos.findIndex(({ id }) => id === todo.id)
            if (todoIndex > -1) {
              this.todos.splice(todoIndex, 1)
            }
          }
        },
        error: (error) => {
          console.log('on error in sub', error)
        },
      })
    },
    unsubscribe() {
      if (this.subTodoCreated) {
        this.subTodoCreated.unsubscribe()
      }
      if (this.subTodosUpdated) {
        this.subTodosUpdated.unsubscribe()
      }
      if (this.subTodosDeleted) {
        this.subTodosDeleted.unsubscribe()
      }
    },
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
      await this.$apollo.mutate({
        mutation: CreateTodo,
        variables: {
          input: {
            title: value,
          },
        },
      })
      this.inputCreateTodo = null
    },
    async updateTodo(todo) {
      await this.$apollo.mutate({
        mutation: UpdateTodo,
        variables: {
          id: todo.id,
          input: {
            title: todo.title,
            completed: todo.completed,
          },
        },
      })
    },
    async toggleAllCompleteTodo(event) {
      if (event.target.checked) {
        await this.$apollo.mutate({
          mutation: CompleteTodos,
          variables: {
            ids: this.todos.filter(({ completed }) => !completed).map(({ id }) => id),
          },
        })
      } else {
        await this.$apollo.mutate({
          mutation: UncompleteTodos,
          variables: {
            ids: this.todos.filter(({ completed }) => completed).map(({ id }) => id),
          },
        })
      }
    },
    async deleteTodo(todo) {
      await this.$apollo.mutate({
        mutation: DeleteTodo,
        variables: {
          id: todo.id,
        },
      })
    },
    async deleteComplete () {
      await this.$apollo.mutate({
        mutation: DeleteTodos,
        variables: {
          ids: this.todos.filter(({ completed }) => completed).map(({ id }) => id),
        },
      })
    },
  }
}
</script>
