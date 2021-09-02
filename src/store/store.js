import Vue from 'vue'
import { firebaseAuth, firebaseDb } from 'boot/firebase'

let messagesRef

const state = {
    userDetails: {},
    users: {},
    messages: {},
    error: null,
    loading: false
}
const mutations = {
    setUserDetails(state, payload) {
        state.userDetails = payload
    },
    addUser(state, payload) {
        Vue.set(state.users, payload.userId, payload.userDetails)
    },
    setError(state, payload) {
        state.error = payload
    },
    updateUser(state, payload) {
        Object.assign(state.users[payload.userId], payload.userDetails)
    },
    addMessage(state, payload) {
        Vue.set(state.messages, payload.messageId, payload.messageDetails)
    },
    clearMessages(state) {
        state.messages = {}
    },
    setLoading(state, payload) {
        state.loading = payload;
    },
    clearError(state) {
        state.error = null;
    }
}
const actions = {
    clearError({ commit }) {
        commit('clearError')
    },
    registerUser({ commit }, payload) {
        commit('setLoading', true);
        commit('clearError')
        firebaseAuth.createUserWithEmailAndPassword(payload.email, payload.password)
            .then(response => {
                console.log(response)
                let userId = firebaseAuth.currentUser.uid;
                commit('setLoading', false);
                firebaseDb.ref('users/' + userId).set({
                    name: payload.name,
                    email: payload.email,
                    online: true
                })
            })
            .catch(error => {
                commit('setLoading', false);
                commit('setError', error)
                console.log(error.message)
            })

    },
    loginUser({ commit }, payload) {
        commit('setLoading', true);
        commit('clearError');
        firebaseAuth.signInWithEmailAndPassword(payload.email, payload.password)
            .then(response => {
                commit('setLoading', false);
                console.log(response)
            })
            .catch(error => {
                commit('setLoading', false);
                commit('setError', error)
                console.log(error.message)
            })

    },
    logoutUser() {
        firebaseAuth.signOut();
    },
    handleAuthStateChanged({ commit, dispatch, state }) {
        commit('setLoading', true);
        firebaseAuth.onAuthStateChanged(user => {
            if (user) {
                //User is logged in
                let userId = firebaseAuth.currentUser.uid;
                firebaseDb.ref('users/' + userId).once('value', snapshot => {
                    let userDetails = snapshot.val();
                    commit('setLoading', false);
                    commit('setUserDetails', {
                        name: userDetails.name,
                        email: userDetails.email,
                        userId: userId
                    })
                });
                dispatch('firebaseUpdateUser', {
                    userId: userId,
                    updates: {
                        online: true
                    }
                })
                dispatch('firebaseGetUsers')
                this.$router.push('/', () => { })
            }
            else {
                //User is logged out
                commit('setLoading', false);
                dispatch('firebaseUpdateUser', {
                    userId: state.userDetails.userId,
                    updates: {
                        online: false
                    }
                })
                commit('setUserDetails', {});
                this.$router.replace('/auth', () => { })
            }
        });
    },
    firebaseUpdateUser({ }, payload) {
        if (payload.userId) {
            firebaseDb.ref('users/' + payload.userId).update(payload.updates);
        }
    },
    firebaseGetUsers({ commit }) {
        firebaseDb.ref('users').on('child_added', snapshot => {
            let userDetails = snapshot.val();
            let userId = snapshot.key;
            commit('addUser', {
                userId,
                userDetails
            })
        })
        firebaseDb.ref('users').on('child_changed', snapshot => {
            let userDetails = snapshot.val();
            let userId = snapshot.key;
            commit('updateUser', {
                userId,
                userDetails
            })
        })
    },

    firebaseGetMessages({ commit }, otherUserId) {
        firebaseAuth.onAuthStateChanged(user => {
            if (user) {
                commit('setLoading', true)
                let userId = state.userDetails.userId
                messagesRef = firebaseDb.ref(`chats/${userId}/${otherUserId}`)
                firebaseDb.ref(`chats/${userId}`).child(otherUserId).once('value', snapshot => {
                    if (snapshot.val() !== null) {
                        messagesRef.on('child_added', snapshot => {
                            let messageDetails = snapshot.val();
                            let messageId = snapshot.key;
                            commit('setLoading', false)
                            commit('addMessage', {
                                messageId,
                                messageDetails
                            })
                        })
                    }
                    else {
                        commit('setLoading', false)
                        messagesRef.on('child_added', snapshot => {
                            let messageDetails = snapshot.val();
                            let messageId = snapshot.key;
                            commit('addMessage', {
                                messageId,
                                messageDetails
                            })
                        })
                    }
                })
            }
            else {
                commit('setLoading', false);
                this.$router.replace('/auth', () => { })
            }
        })

    },
    firebaseStopGettingMessages({ commit }) {
        if (messagesRef) {
            messagesRef.off('child_added')
            commit('clearMessages')
        }
    },
    firebaseSendMessage({ }, payload) {
        firebaseDb.ref(`chats/${state.userDetails.userId}/${payload.otherUserId}`)
            .push(payload.message)
        payload.message.from = 'them';
        firebaseDb.ref(`chats/${payload.otherUserId}/${state.userDetails.userId}`)
            .push(payload.message)
    }
}
const getters = {
    users: state => {
        let usersFiltered = {};
        Object.keys(state.users).forEach(key => {
            if (key !== state.userDetails.userId) {
                usersFiltered[key] = state.users[key]
            }
        })
        return usersFiltered;
    },
    error(state) {
        return state.error
    },
    loading(state) {
        return state.loading
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}