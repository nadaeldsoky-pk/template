<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card v-if="user">
      <v-card-title class="headline">{{ user.full_name || user.name }}</v-card-title>
      <v-card-text>
        <div class="user-details">
          <p><strong>ID:</strong> {{ user.id }}</p>
          <p><strong>Department:</strong> {{ user.department_name }}</p>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    user: Object,
    modelValue: Boolean
  },
  computed: {
    dialog: {
      get() { return this.modelValue },
      set(val) { this.$emit('update:modelValue', val) }
    }
  },
  methods: {
    close() {
      this.$emit('update:modelValue', false)
    }
  }
}
</script>
