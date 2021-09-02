<template>
  <q-page class="flex q-pa-md">
    <div v-if="loading" class="fixed-center">
      <div class="q-gutter-md row items-center">
        <q-spinner-cube size="5.5em" color="primary" />
      </div>
    </div>
    <q-list v-else separator class="full-width">
      <q-item
        v-for="(user, key) in users"
        :key="key"
        :to="`/chat/${key}`"
        clickable
        v-ripple
      >
        <q-item-section avatar>
          <q-avatar color="primary" text-color="white">
            {{ user.name.charAt(0) }}
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ user.name }}</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-badge :color="user.online ? 'light-green-5' : 'grey-6'">
            {{ user.online ? "Online" : "Offline" }}
          </q-badge>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters("store", ["users", "loading"]),
  },
};
</script>
