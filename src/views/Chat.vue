<template>
  <v-container fluid>
    <v-row>
        <v-col cols="4">
            <v-card>
                <v-app-bar dark>
                    <v-toolbar-title>
                        Chats:
                    </v-toolbar-title>
                </v-app-bar>
                <v-card-text class="pt-1">
                    <div class="scroll2">
                        <v-list two-line v-if="chats.length > 0">
                          <v-list-item-group active-class="black--text">
                            <template v-for="(item, index) in chats">
                              <v-list-item :key="item.id" @click="selectTask(item)">
                                <template v-slot:default="{ active }">
                                    <v-list-item-avatar size="10px" class="ml-2 px-2 py-2">
                                        <v-badge color="red" right overlap v-if="item.new_msg > 0">
                                            <template v-slot:badge>
                                                {{item.new_msg}}
                                            </template>
                                            <v-avatar color="grey darken-2">
                                                <v-icon color="white">mdi-calendar</v-icon>
                                            </v-avatar>
                                        </v-badge>
                                        <v-avatar color="grey darken-2" v-else>
                                            <v-icon color="white">mdi-calendar</v-icon>
                                        </v-avatar>
                                    </v-list-item-avatar>
                                  <v-list-item-content>
                                    <v-list-item-title>{{ item.client_code }} / {{ item.project_name }}</v-list-item-title>
                                    <v-list-item-subtitle class="text--primary" >{{ item.task_name }}</v-list-item-subtitle>
                                  </v-list-item-content>
                                  <v-list-item-action>
                                    <v-list-item-action-text>{{ item.lstmsg_date }}</v-list-item-action-text>
                                    <v-icon v-if="!active" color="grey lighten-1" >
                                      mdi-check-outline
                                    </v-icon>
                                    <v-icon v-else color="primary darken-3">
                                      mdi-check
                                    </v-icon>
                                  </v-list-item-action>
                                </template>
                              </v-list-item>
                              <v-divider v-if="index < chats.length - 1" :key="item.datetime_added"></v-divider>
                            </template>
                          </v-list-item-group>
                        </v-list>
                        <div v-else class="text-center">
                            <h3 class="mt-3">No chats available at the moment.</h3>
                        </div>
                    </div>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col cols="8">
            <v-card :disabled="chats.length <= 0">
                <v-card-text class="pa-1" v-show="task_name != ''">
                    <v-row dense>
                        <v-col cols="10">
                            <h2 class="py-2 pl-3">{{ task_name }}</h2>
                        </v-col>
                        <v-col cols="2">
                            <v-btn router :to="{ name: 'task-edit', params: { taskId: selected }}" color="success darken-2">Open Task</v-btn>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-app-bar dark class="px-0">
                    <v-col cols="6" class="px-1">
                        <v-text-field outlined label="Search" v-model="search_word" @blur="getMessagesFilter(selected)" small hide-details></v-text-field>
                    </v-col>
                    <v-col cols="3" class="px-1">
                        <v-select hide-details :items="usersList" v-model="selectedUser" @change="getMessagesFilter(selected)" outlined label="User"></v-select>
                    </v-col>
                    <v-col cols="3" class="px-1">
                        <v-select hide-details outlined label="View" :items="viewList" @change="getMessagesFilter(selected)" v-model="selectedView"></v-select>
                    </v-col>
                </v-app-bar>
                <v-card-text>
                    <div v-if="messages.length == 0" class="scroll">
                    </div>
                    <div v-else class="scroll">
                        <div v-for="message in messages" ref="msgContainer" :key="message.id">
                            <div v-if="!message.isOwner" style="background-color: #e5e5e5; border-radius: 15px; border: 1px solid black; max-width: 600px; padding: 10px; margin-bottom: 20px;">
                                <v-avatar size="30" style="margin-right: 5px;" :color="message.bgColor">
                                    <span class='text-center' :style="{ color: message.fColor, fontSize: '12px' }"><b>{{ message.code }}</b></span>
                                </v-avatar>
                                <b>{{ message.name }}</b> 
                                <small><i>{{ message.created_at }}</i></small>
                                <v-divider class="mb-1 mt-2"></v-divider>
                                <div id="messages" v-html="message.message"></div>
                            </div>
                            <div v-if="message.isOwner" ref="msgContainer" class="ml-auto" style="background-color: #e8ebfa; border-radius: 15px; border: 1px solid black; max-width: 600px; padding: 10px; margin-bottom: 20px;">
                                <v-avatar size="30" style="margin-right: 5px;" :color="message.bgColor">
                                    <span class='text-center' :style="{ color: message.fColor, fontSize: '12px' }"><b>{{ message.code }}</b></span>
                                </v-avatar>
                                <b>{{ message.name }}</b> 
                                <small><i>{{ message.created_at }}</i></small>
                                <v-divider class="mb-1 mt-2"></v-divider>
                                <div id="messages" v-html="message.message"></div>
                            </div>
                        </div>
                    </div>
                    <v-row>
                        <v-col cols="12" v-show="isActive">
                            <v-btn-toggle v-model="toggle_exclusive" rounded>
                                <v-btn small @click="toggleActive()">
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                            </v-btn-toggle>
                            <vue-editor v-model="content" :editorToolbar="customToolbar">
                            </vue-editor>
                        </v-col>
                        <v-col>
                            <v-textarea outlined label="Message" hide-details rows="1" v-model="content2" v-show="!isActive">
                                <template v-slot:prepend>        
                                    <v-btn-toggle dense v-model="toggle_exclusive" rounded>
                                        <v-btn small @click="toggleActive()">
                                            <v-icon>mdi-pencil</v-icon>
                                        </v-btn>
                                    </v-btn-toggle>
                                </template>
                                <template v-slot:append>        
                                    <v-btn small rounded elevation="1" color="primary" @click="sendMsg()"><v-icon>mdi-send</v-icon></v-btn>
                                </template>
                            </v-textarea>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="2" class="pr-0"><b v-if="usersNotList.length > 0">Add to task:</b></v-col>
                        <v-col cols="1" class="px-0" v-for="item in usersNotList" :key="item.value">
                            <v-checkbox hide-details class="mt-0" :label="item.text" :value="item.value" v-model="userschk">
                                <template v-slot:label>
                                    <v-avatar size="30" :color="item.bgColor">
                                        <span class='text-center' :style="{ color: item.fColor, fontSize: '12px' }"><b>{{ item.text }}</b></span>
                                    </v-avatar>
                                </template>
                            </v-checkbox>
                        </v-col>
                        <v-col class="text-end" v-show="isActive">
                            <v-btn elevation="1" color="primary" @click="sendMsg()"><v-icon>mdi-send</v-icon></v-btn>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>

  </v-container>
</template>

<script>
import { VueEditor } from "vue2-editor";
export default {
    components: {
        VueEditor
    },
    data() {
        return {
            messages: [],
            isActive: false,
            selected: '',
            content: '',
            content2: '',
            usersList: [],
            usersNotList: [],
            userschk: [],
            selectedUser: '',
            search_word: '',
            viewList: [],
            selectedView: '',
            toggle_exclusive: false,
            customToolbar: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                [{ 'font': [] }],
                ["bold", "italic", "underline" ],
                ['link'],
                [{ list: "ordered" }, { list: "bullet" }],
                [{ 'indent': '-1'}, { 'indent': '+1' }],
                [{ 'color': [] }, { 'background': [] }]
            ],
            chats: [],
            task_name: ''
        }
    },
    mounted() {
        this.getChats();
        Events.$on("reload-chats", () => {
            this.getChats()
        })
    },
    methods: {
        scrollToEnd(){
            var container = document.querySelector('.scroll');
            var scrollHeight = container.scrollHeight;
            container.scrollTop = scrollHeight;
        },
        toggleActive() {
            this.isActive = !this.isActive
            this.content = ''
            this.content2 = ''
        },
        sendMsg(){
            var listUsers = this.userschk.join(',')
            this.apiCall("send-message-chat", {task_id: this.selected, message: this.content, message2: this.content2, users: listUsers}).then((res) => {
                if (res.success){
                    this.content = ''
                    this.content2 = ''
                    this.getMessagesFilter(this.selected)
                }
            })
        },
        selectTask(item){
            this.selected = item.id
            this.task_name = item.client_code + " / " + item.project_name + " / " + item.task_name
            this.userschk = []
            this.viewList = [
                {
                    text: 'This task only',
                    value: 'task'
                },
                {
                    text: 'This Project',
                    value: 'proj'
                },
                {
                    text: 'This Client',
                    value: 'client'
            }]
            this.selectedView = 'task'
            setTimeout(() => {
                this.scrollToEnd();
            }, 400);
            this.getMessagesFilter(item.id)
        },
        getMessagesFilter(id) {
            this.messages = []
            this.apiCall('get-messages-filter', {task_id: id, search_word: this.search_word, user_id: this.selectedUser, view: this.selectedView}).then((res) => {
                if (res.success) {
                    if(this.messages.length < res.messages.length){
                       setTimeout(() => {
                            this.scrollToEnd()
                       }, 350); 
                    }
                    this.messages = res.messages
                }
            }).catch((error) => {
                console.log(error)
            });
            this.getUsersInTask(id)
        },
        getUsersInTask(id) {
            this.usersList = []
            this.apiCall('get-users-in-task', {task_id: id}).then((res) => {
                if (res.success) {
                    this.usersList = res.users_in
                    this.usersNotList = res.users_not
                    Events.$emit('reload-chats')
                }
            }).catch((error) => {
                console.log(error)
            });
        },
        getChats(){
            this.apiCall("get-chats").then((res) => {
                if (res.success){
                    this.chats = res.chats
                }
            })
        }
    }
}
</script>

<style>
    img {
        width: 100%;
        height: auto;
        padding-top: 5px;
    }
    .scroll2 {
        max-height: 250px; 
        min-height: 70vh; 
        overflow-y: scroll;
    }
    .scroll {
        max-height: 250px; 
        min-height: 400px; 
        overflow-y: scroll; 
        padding-left: 25px; 
        padding-top: 25px; 
        padding-right: 25px;
    }

</style>