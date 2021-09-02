<template>
  <q-page class="flex column page-chat" ref="pageChat">
    <q-banner
      v-if="!otherUserDetails.online"
      class="bg-grey-4 text-center fixed-top"
      dense
    >
      {{ otherUserDetails.name }} is offline
    </q-banner>
    <div v-if="loading" class="fixed-center">
      <q-spinner-comment color="primary" size="5.5em" />
    </div>
    <div
      v-else
      :class="{ invisible: !showMessages }"
      class="q-pa-md column col justify-end"
    >
      <q-chat-message
        class="text-white"
        v-for="(message, key) in messages"
        :key="key"
        :name="message.from == 'me' ? userDetails.name : otherUserDetails.name"
        :text="[message.text]"
        :sent="message.from == 'me' ? true : false"
        :bg-color="message.from == 'me' ? 'grey-3' : 'light-green-3'"
      />
    </div>
    <q-footer elevated>
      <q-toolbar>
        <q-form @submit="sendMessage" class="full-width">
          <q-input
            v-model="newMessage"
            ref="newMessage"
            bg-color="white"
            rounded
            outlined
            placeholder="Type message here..."
            autocomplete="off"
            dense
          >
            <template v-slot:after>
              <q-btn
                @click="sendMessage"
                round
                dense
                flat
                :disable="newMessage == ''"
                color="white"
                icon="send"
              />
            </template>
          </q-input>
        </q-form>
      </q-toolbar>
    </q-footer>
  </q-page>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import mixinOtherUserDetails from "src/mixins/mixin-other-user-details";

export default {
  mixins: [mixinOtherUserDetails],
  data() {
    return {
      newMessage: "",
      showMessages: false,
    };
  },
  computed: {
    ...mapGetters("store", ["loading"]),
    ...mapState("store", ["messages", "userDetails"]),
  },
  methods: {
    ...mapActions("store", [
      "firebaseGetMessages",
      "firebaseStopGettingMessages",
      "firebaseSendMessage",
    ]),
    sendMessage() {
      this.firebaseSendMessage({
        message: {
          text: this.newMessage,
          from: "me",
        },
        otherUserId: this.$route.params.otherUserId,
      });
      this.clearMessage();
    },
    clearMessage() {
      this.newMessage = "";
      this.$refs.newMessage.focus();
    },
    scrollToBottom() {
      let pageChat = this.$refs.pageChat.$el;
      setTimeout(() => {
        window.scrollTo(0, pageChat.scrollHeight);
      }, 20);
    },
  },
  watch: {
    messages: function (val) {
      if (Object.keys(val).length) {
        this.scrollToBottom();
        setTimeout(() => {
          this.showMessages = true;
        }, 200);
      }
    },
  },
  mounted() {
    this.firebaseGetMessages(this.$route.params.otherUserId);
  },
  destroyed() {
    this.firebaseStopGettingMessages();
  },
};
</script>

<style scoped>
.page-chat {
  background: radial-gradient(black 15%, transparent 16%) 0 0,
    radial-gradient(black 15%, transparent 16%) 8px 8px,
    radial-gradient(rgba(255, 255, 255, 0.1) 15%, transparent 20%) 0 1px,
    radial-gradient(rgba(255, 255, 255, 0.1) 15%, transparent 20%) 8px 9px;
  background-color: #282828;
  background-size: 16px 16px;
}
.q-banner {
  top: 50px;
  z-index: 2;
  opacity: 0.8;
}
</style>
