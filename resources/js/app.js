/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require("./bootstrap");

window.Vue = require("vue");
import Vue from "vue";
import Toaster from "v-toaster";
import "v-toaster/dist/v-toaster.css";
Vue.use(Toaster, { timeout: 5000 });

import VueChatScroll from "vue-chat-scroll";
Vue.use(VueChatScroll);

Vue.component("message", require("./components/message.vue").default);

const app = new Vue({
    el: "#app",
    data: {
        message: "",
        chat: {
            message: [],
            user: [],
            color: [],
            time: []
        },
        typing: "",
        numberOfUsers: 0
    },
    watch: {
        message() {
            Echo.private("chat").whisper("typing", {
                name: this.message
            });
        }
    },
    methods: {
        send() {
            if (this.message.length != 0) {
                this.chat.message.push(this.message);
                this.chat.color.push("success");
                this.chat.user.push("you");
                this.chat.time.push(this.getTime());
                axios
                    .post("/send", {
                        message: this.message,
                        chat: this.chat
                    })
                    .then(response => {
                        console.log(response);
                        this.message = "";
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        },
        getTime() {
            let time = new Date();
            return time.getHours() + ":" + time.getMinutes();
        },
        getOldMessage() {
            axios
                .post("/getOldMessage")
                .then(response => {
                    console.log(response);
                    if (response.data != "") {
                        this.chat = response.data;
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        },
        deleteSession() {
            axios.post("/deleteSession").then(response => {
                this.chat = {};
                this.$toaster.success("Chat history is deleted");
            });
        }
    },
    mounted() {
        this.getOldMessage();
        Echo.private("chat")
            .listen("chatEvent", e => {
                this.chat.message.push(e.message);
                this.chat.color.push("warning");
                this.chat.user.push(e.user);
                this.chat.time.push(this.getTime());
                axios
                    .post("/saveToSession", {
                        chat: this.chat
                    })
                    .then(response => {
                        console.log(response);
                        if (response.data != "") {
                            this.chat = response.data;
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            })
            .listenForWhisper("typing", e => {
                if (e.name != "") {
                    this.typing = "typing...";
                } else {
                    this.typing = "";
                }
            });
        Echo.join(`chat`)
            .here(users => {
                this.numberOfUsers = users.length;
            })
            .joining(user => {
                this.$toaster.success(user.name + " is join the chat room");
                this.numberOfUsers++;
            })
            .leaving(user => {
                this.$toaster.warning(user.name + " is leaved the chat room");
                this.numberOfUsers--;
            });
    }
});
