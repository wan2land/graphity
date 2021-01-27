<template>
  <section class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <input class="new-todo" placeholder="What needs to be done?" autofocus v-model="inputTodo" @keyup.enter="createTodo">
    </header>
		<section class="main" v-if="todos.length">
			<input class="toggle-all" type="checkbox" @click="allDone">
			<label for="toggle-all">Mark all as complete</label>
			<ul class="todo-list">
        <li v-for="(todo, todoIndex) in todos" :class="{'completed': todo.completed, 'editing': todo === editedTodo}" :key="todoIndex">
          <div class="view">
            <input class="toggle" type="checkbox" v-model="todo.completed">
            <label @dblclick="editTodo(todo)">{{ todo.title }}</label>
            <button class="destroy" @click="removeTodo(todo)"></button>
          </div>
          <input class="edit" type="text" v-model="todo.title" v-todo-focus="todo == editedTodo" @blur="doneEdit(todo)" @keyup.enter="doneEdit(todo)" @keyup.esc="cancelEdit(todo)">
        </li>
			</ul>
		</section>
    <footer class="footer" v-if="todos.length">
      <span class="todo-count"><strong>{{ remaining }}</strong> item<span v-if="remaining > 1">s</span> left</span>
      <ul class="filters">
        <li>
          <nuxt-link to="/" exact>All</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/active">Active</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/completed">Completed</nuxt-link>
        </li>
      </ul>
      <button class="clear-completed" @click="removeCompleted" v-if="todos.length > remaining">
        Clear completed
      </button>
    </footer>
	</section>
</template>
<script>
export default {
  data () {
    return {
      inputTodo: '',
      todos: [],
    }
  },
  computed: {
    todos () {
      // return this.$store.getters.allTodos
    },
    actives () {
      // return this.$store.getters.activeTodos
    },
    remaining () {
      return this.todos.filter(todo => !todo.completed).length
    },
  },
  methods: {
    createTodo () {
      const value = this.inputTodo && this.inputTodo.trim()
      if (value) {
        // this.$store.dispatch('createTodo', { title: value, completed: this.$route.params.slug === 'completed' })
        this.inputTodo = null
      }
    },
    removeCompleted () {
      // this.$store.dispatch('setTodos', this.actives)
    },
  }
}
</script>
