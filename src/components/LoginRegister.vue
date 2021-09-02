<template>
  <q-form @submit="submitForm">
    <q-banner
      v-if="error"
      inline-actions
      rounded
      class="text-white bg-red q-mb-sm"
    >
      {{ error.message }}
      <template v-slot:action>
        <q-btn @click="onDismissed" round dense flat icon="cancel" />
      </template>
    </q-banner>
    <q-input
      v-if="tab == 'register'"
      class="q-mb-sm"
      outlined
      v-model="formData.name"
      label="Name"
      required
    />
    <q-input
      class="q-mb-sm"
      outlined
      v-model="formData.email"
      label="Email"
      type="email"
      required
    />
    <q-input
      class="q-mb-sm"
      outlined
      v-model="formData.password"
      label="Password"
      type="password"
      :rules="[
        (val) => !!val || '* Required',
        (val) => val.length > 5 || 'Please use minimum 6 character',
      ]"
      lazy-rules
    />
    <div class="row">
      <q-space></q-space>
      <q-btn color="primary" :label="tab" type="submit" :loading="loading" />
    </div>
  </q-form>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  props: ["tab"],
  data() {
    return {
      formData: {
        name: "",
        email: "",
        password: "",
      },
    };
  },
  computed: {
    ...mapGetters("store", ["error", "loading"]),
  },
  methods: {
    ...mapActions("store", ["registerUser", "loginUser", "clearError"]),
    submitForm() {
      if (this.tab == "login") {
        this.loginUser(this.formData);
      } else {
        this.registerUser(this.formData);
      }
    },
    onDismissed() {
      this.clearError();
    },
  },
};
</script>

<style>
</style>