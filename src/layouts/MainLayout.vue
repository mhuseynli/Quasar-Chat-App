<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          v-go-back.single
          v-if="$route.fullPath.includes('/chat')"
          icon="arrow_back"
          flat
          dense
          label="BACK"
        />
        <q-toolbar-title class="absolute-center">
          {{ title }}
        </q-toolbar-title>
        <q-btn
          v-if="!userDetails.userId"
          to="/auth"
          class="absolute-right q-pr-sm"
          no-caps
          icon="account_circle"
          flat
          dense
          label="Login"
          :loading="loading"
        />
        <q-btn
          @click="logoutUser"
          v-else
          class="absolute-right q-pr-sm"
          no-caps
          icon="account_circle"
          flat
          dense
        >
          Logout <br />
          {{ userDetails.name }}
        </q-btn>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import mixinOtherUserDetails from "src/mixins/mixin-other-user-details"; 

export default {
  mixins: [mixinOtherUserDetails],
  computed: {
    ...mapState("store", ["userDetails"]),
    ...mapGetters("store", ["loading"]),
    title() {
      let currentPath = this.$route.fullPath;
      if (currentPath == "/") return "Simple Chat";
      else if (currentPath.includes("/chat")) return this.otherUserDetails.name;
      else if (currentPath == "/auth") return "Login";
    },
  },
  methods: {
    ...mapActions("store", ["logoutUser"]),
  },
};
</script>

<style lang="stylus" scoped>
.q-toolbar {
  .q-btn {
    line-height: 1.2;
  }
}
</style>