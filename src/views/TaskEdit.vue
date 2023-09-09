<template>
    <div>
        <v-container fluid>
            <v-row class="mx-2">
                <v-col cols="8">
                    <v-card>
                        <v-app-bar dark dense>
                            <v-toolbar-title>
                                Task:
                            </v-toolbar-title>
                            <v-spacer></v-spacer>
                        </v-app-bar>
            
                        <v-card-text>
                            <div v-show="errors != []">
                                <v-alert :type="color" v-for="error in errors" :key="error.index">
                                    {{error}}
                                </v-alert>
                            </div>
                            <v-row>
                                <v-col cols="11">
                                    <h2>{{ taskInfo.client_code }} / {{ taskInfo.project_name }} / {{taskInfo.task_name}} <edit-task :task_id="taskInfo.id"></edit-task></h2>
                                </v-col>
                                <v-col cols="1" class="text-right">
                                    <v-avatar size="30" :color="taskInfo.owner_bgcolor">
                                        <span class='text-center' :style="{ color: taskInfo.owner_fcolor, fontSize: '12px' }"><b>{{ taskInfo.owner }}</b></span>
                                    </v-avatar>
                                </v-col>
                            </v-row>
                            <v-divider></v-divider>
                            <v-row>
                                <v-col cols="4">
                                    <p><b>Due Date:</b> {{ taskInfo.task_date_eta }}</p>
                                    <p><b>Priority: </b><v-chip small :color="'#'+taskInfo.priority_bgcolor" :style="{color: '#'+taskInfo.priority_fcolor}">{{ taskInfo.priority }}</v-chip></p>
                                    <p><b>Start Date:</b> {{ taskInfo.task_date_start }}</p>
                                </v-col>
                                <v-col cols="4" class="text-center">
                                    <p><b>{{ taskInfo.type }}</b></p>
                                    <p>{{ taskInfo.area }}</p>
                                    <h2 v-show="taskInfo.task_hold" style="#FFC107"><v-icon color="warning">mdi-alert-octagon</v-icon> HOLD</h2>
                                    <h2 v-show="taskInfo.rejected" style="color: red;"><v-icon color="error">mdi-repeat</v-icon> REJECTED</h2>
                                    <v-row v-show="taskInfo.accepted == 1 && taskInfo.isOwner == 1 && taskInfo.completed != 1">
                                        <v-col cols="7">
                                            <cancel-modal  color="success darken-2"></cancel-modal>
                                        </v-col>
                                        <v-col cols="5" class="px-0">
                                            <v-btn block color="success darken-2" @click="completeTask()">Completed</v-btn>
                                        </v-col>
                                    </v-row>
                                    <v-row v-show="taskInfo.accepted == 0 && taskInfo.rejected == 0 && taskInfo.task_hold == 0 && taskInfo.isOwner == 1">
                                        <v-col cols="6" style="border-right: 1px solid lightgrey;"><v-btn color="success darken-2" @click="acceptTask">Accept</v-btn></v-col> 
                                        <v-col cols="6"><reject-modal :task_id="taskInfo.id" :task_name="taskInfo.task_name"></reject-modal></v-col>
                                    </v-row>
                                </v-col>
                                <v-col cols="4" class="text-right">
                                    <p><b>Status: </b><v-chip small :color="'#'+taskInfo.status_bgcolor" :style="{color: '#'+taskInfo.status_fcolor}">{{ taskInfo.status }}</v-chip><b> {{taskInfo.progress_pct}}% </b></p>
                                    <p><b>Collaborators:</b></p>
                                    <div class='d-inline-block' v-for="collab in taskInfo.collaborators" :key="collab.id">
                                        <v-avatar size="30" style="margin-right: 5px;" :color="collab.bgColor">
                                            <span class='text-center' :style="{ color: collab.fColor, fontSize: '12px' }"><b>{{ collab.code }}</b></span>
                                        </v-avatar>
                                    </div>
                                </v-col>
                                <v-col cols="12" class="text-start" v-show="taskInfo.rejected">
                                    <p><b>Rejected reason: </b>{{taskInfo.task_rejected_reason}}</p>
                                </v-col>
                            </v-row>
                            <v-divider></v-divider>
                            <v-row>
                                <v-col cols="12">
                                    <h4>Details:</h4>
                                    <p>{{taskInfo.task_description}}</p>
                                </v-col>
                            </v-row>
                            <v-divider></v-divider>
                            <v-row>
                                <v-col cols="4">
                                    <p><b>Total Time:</b> {{ taskInfo.time }} / {{ taskInfo.estimated_hrs }} estimated</p>
                                </v-col>
                                <v-col class="text-center" cols="4">
                                    <div v-if="taskInfo.accepted">
                                        <start-timer v-if="taskInfo.timer_started == 0" :task_id="taskInfo.id" :task_name="taskInfo.task_name" :project_name="taskInfo.project_name" :prev_details="taskInfo.prev_details"></start-timer>
                                        <stop-timer 
                                        v-if="taskInfo.timer_started == 1" 
                                        :task_id="taskInfo.id" 
                                        :timer_id="taskInfo.timer_id" 
                                        :dateStarted="taskInfo.timer_start_date" 
                                        :timeStarted="taskInfo.timer_start_time"
                                        :timerDetails="taskInfo.timer_details"
                                        :taskType="taskInfo.timer_type">
                                        </stop-timer>
                                    </div>
                                </v-col>
                                <v-col cols="4" class="text-right">
                                    <p><b>All Timers:</b> | <logs></logs></p>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                    <br>
                    <v-card :disabled="!taskInfo.accepted">
                        <v-app-bar dark dense>
                            <v-toolbar-title>
                                Chat
                            </v-toolbar-title>
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
                            <vue-editor v-model="content" :editorToolbar="customToolbar">
                            </vue-editor>
                                <div class="text-end">
                                    <v-btn elevation="0" color="primary" @click="sendMsg()"><v-icon>mdi-send</v-icon></v-btn>
                                </div>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="4">
                    <v-card :disabled="!taskInfo.accepted">
                        <v-app-bar dark dense>
                            <v-toolbar-title>
                                To-Do List: {{taskInfo.todoCount }}
                            </v-toolbar-title>
                            <v-spacer></v-spacer>
                            <create-todo :task_id="taskInfo.id"></create-todo>
                        </v-app-bar>
                        <v-card-text>
                            <v-row dense>
                                <v-col cols="12">
                                    <v-data-table hide-default-footer :items="taskInfo.todo" fixed-header :headers="headers" scrollable max-height="300px">
                                        <template v-slot:item.delete="{ item }">
                                            <v-icon big color="error darken-2" @click="deleteTodo(item.id)">mdi-delete</v-icon>
                                        </template>
                                        <template v-slot:item.description="{ item }">
                                            <edit-checklist :todo_id="item.id" :description="item.description" :task_id="taskInfo.id"></edit-checklist>
                                        </template>
                                        <template v-slot:item.priority="{ item }">
                                            <v-icon v-if="item.priority == 1" color="error darken-2">mdi-exclamation</v-icon>
                                        </template>
                                        <template v-slot:item.completed="{ item }">
                                            <v-checkbox color="success" style="margin-top: 0px;" hide-details v-model="item.completed" @change="changeStatus(item.id, item.completed)"></v-checkbox>
                                        </template>
                                    </v-data-table>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                    <br>
                    <v-card :disabled="!taskInfo.accepted">
                        <v-app-bar dark dense>
                            <v-toolbar-title>
                                Documents:
                            </v-toolbar-title>
                            <v-spacer></v-spacer>
                            <add-documents :task_id="taskInfo.id"></add-documents>
                        </v-app-bar>
                        <v-card-text>
                            <v-row dense>
                                <v-col cols="12">
                                    <v-data-table :items="taskInfo.docs" :headers="headers2">
                                        <template v-slot:item.delete="{ item }">
                                            <v-icon big color="error darken-2" @click="deleteDoc(item.id)">mdi-delete</v-icon>
                                        </template>
                                        <template v-slot:item.download="{ item }">
                                            <a target="_blank" download :href="'https://pass2.design2net.com/documents/' + item.filename"><v-icon>mdi-download</v-icon></a>
                                        </template>
                                    </v-data-table>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                    <br>
                    <v-card :disabled="!taskInfo.accepted">
                    <v-toolbar class="elevation-0" dark>
                        <v-toolbar-title>Timers:</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <add-timer :task_id="taskInfo.id" :task_name="taskInfo.task_name" :project_name="taskInfo.project_name" :prev_details="taskInfo.prev_details"></add-timer>
                    </v-toolbar>
                    <v-card-text class="scroll2">
                        <table width="100%">
                            <tr v-for="timer in timers" :key="timer.timer_id">
                                <td style="word-wrap: break-word; white-space: pre-wrap; border-bottom: 1px solid lightgrey;">
                                    <edit-timer 
                                    :label="timer.start_time_label + ' - ' + timer.end_time_label"
                                    :task_id="timer.task_id" 
                                    :client_id="timer.client_id" 
                                    :project_id="timer.project_id" 
                                    :timer_id="timer.timer_id"
                                    :start_tm="timer.start_time" 
                                    :start_dt="timer.start_date" 
                                    :end_tm="timer.end_time" 
                                    :end_dt="timer.end_date"
                                    :notes="timer.timer_details"
                                    :tp="timer.task_type_id"
                                    class="d-inline-block">
                                    </edit-timer>
                                    <p style="font-weight: bold;" class="mb-0">
                                    <v-avatar size="23" :color="timer.bgColor">
                                      <span class='text-center' :style="{ color: timer.fColor, fontSize: '11px' }"><b>{{ timer.user_code }}</b></span>
                                    </v-avatar> Type: {{ timer.type_label }} - Elapsed: ({{timer.elapsed_time}})</p>
                                    <p>{{ timer.timer_details}}</p>
                                </td>
                            </tr>
                        </table>
                    </v-card-text>
                </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>
<script>
    import EditChecklist from '@/components/EditCheckModal.vue'
    import CreateTodo from '@/components/CreateCheckModal.vue'
    import EditTask from '@/components/EditTaskModal.vue'
    import StartTimer from '@/components/CreateTaskTimerModal.vue'
    import StopTimer from '@/components/EditTaskTimerModal.vue'
    import AddDocuments from '@/components/AddDocumentModal.vue'
    import RejectModal from '@/components/RejectTaskModal.vue'
    import CancelModal from '@/components/CancelTaskModal.vue'
    import EditTimer from '@/components/EditTimerModalConfigFull.vue'
    import AddTimer from '@/components/AddTimer.vue'
    import Logs from '@/components/LogsModal.vue'
    import { VueEditor } from "vue2-editor";
    export default {
        components: {
            EditChecklist,
            Logs,
            CreateTodo,
            EditTask,
            StartTimer,
            StopTimer,
            AddDocuments,
            VueEditor,
            RejectModal,
            CancelModal,
            AddTimer,
            EditTimer
        },
        data() {
            return {
                selectedClient: '',
                selectedPrio: '',
                selectedStatus: '',
                selectedType: '',
                selectedArea: '',
                selectedProject: '',
                selectedTask: '',
                details: '',
                hh: 0,
                mm: 0,
                pct: 0,
                prev_details: {},
                content: '',
                task_name: '',
                selectedUsers: [],
                selectedOwner: '',
                statuses: [],
                users: [],
                menu2: false,
                menu3: false,
                date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
                date2: '',
                dialog: false,
                errors: [],
                clients: [],
                projects: [],
                prios: [],
                areas: [],
                types: [],
                color: '',
                count: 0,
                userdp: [],
                messages: [],
                taskInfo: {},
                timers: [],
                customToolbar: [
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    [{ 'font': [] }],
                    ["bold", "italic", "underline" ],
                    ['link'],
                    [{ list: "ordered" }, { list: "bullet" }],
                    [{ 'indent': '-1'}, { 'indent': '+1' }],
                    [{ 'color': [] }, { 'background': [] }]
                ],
                headers: [{
                    text: "Stat.",
                    align: 'left',
                    value: "completed"
                }, {
                    text: "ETA",
                    align: 'left',
                    value: "eta"
                },{
                    text: 'Prio.',
                    align: 'center',
                    value: 'priority'
                },{
                    text: "Desc.",
                    align: 'left',
                    value: 'description'
                }, {
                    text: "Del",
                    align: 'center',
                    value: "delete"
                }],
                headers2: [{
                    text: "Doc.",
                    align: 'left',
                    value: "description"
                },
                {
                    text: 'Download',
                    align: 'center',
                    value: 'download'
                },
                {
                    text: "Del",
                    align: 'center',
                    value: "delete"
                }]
            }
        },
        watch: {
            selectedClient(){
                this.getProjects()
            }
        },
        mounted() {
            this.getTaskInfo()
            this.getTaskTimers(this.$route.params.taskId)
            this.getMessages()
            this.scrollToEnd()
            Events.$on("reload", () => {
                this.getTaskInfo()
                this.getMessages()
                this.getTaskTimers(this.$route.params.taskId)
            })
            Events.$on("reload-edit", () => {
                this.getTaskInfo()
                this.getMessages()
                this.getTaskTimers(this.$route.params.taskId)
            })
        },
        updated(){
            this.scrollToEnd()
        },
        methods: {
            getTaskInfo(){
                this.apiCall('get-task-info',{id: this.$route.params.taskId}).then((res) => {
                if (res.success) {
                    this.taskInfo = res.task_info
                }
                }).catch((error) => {
                    console.log(error)
                })
            },
            getTaskTimers(value){
                this.selectedTask = value
                this.apiCall('get-task-timers', {user_id: this.$session.get('user_id'), task_id: this.selectedTask}).then((res) => {
                  if(res.success){
                    this.timers = res.timers
                  }
                }).catch((error) => {
                  console.log(error)
                })
            },
            getProjects() {
                this.projects = []
                this.apiCall('get-projects-dropdown', {client: this.selectedClient}).then((res) => {
                    if (res.success) {
                        res.projects.forEach(element => {
                            this.projects.push({text: element.project_name, value: element.project_id})
                        });
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            sendMsg() {
                this.apiCall('send-message', {task_id: this.$route.params.taskId, message: this.content}).then((res) => {
                    if (res.success) {
                        this.getTaskInfo()
                        this.getMessages()
                        this.content = ''
                    }
                }).catch((error) => {
                    console.log(error)
                });
            },
            getMessages() {
                this.apiCall('get-messages', {task_id: this.$route.params.taskId}).then((res) => {
                    if (res.success) {
                        this.messages = res.messages
                    }
                }).catch((error) => {
                    console.log(error)
                });
            },
            scrollToEnd(){
                var container = document.querySelector('.scroll');
                var scrollHeight = container.scrollHeight;
                container.scrollTop = scrollHeight;
            },
            changeStatus(id,stat){
                this.apiCall('change-checklist-status', {id: id, status: stat}).then((res) => {
                    if (res.success) {
                        this.getTaskInfo()
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            acceptTask(){
                this.apiCall('accept-task-config', {task_id: this.$route.params.taskId}).then((res) => {
                    if (res.success) {
                        this.getTaskInfo()
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            createUser() {
                this.errors = []
                this.apiCall("create-task", {
                    task_name: this.task_name,
                    client_id: this.selectedClient,
                    project_id: this.selectedProject,
                    priority: this.selectedPrio,
                    status: this.selectedStatus,
                    type: this.selectedType,
                    area: this.selectedArea,
                    details: this.details,
                    hh: this.hh,
                    mm: this.mm,
                    pct: this.pct,
                    owner: this.selectedOwner,
                    collabs: this.selectedUsers.join(','),
                    date_start: this.date,
                    date_end: this.date2
                }).then((res) => {
                    if(res.success){
                        this.errors = ['Task successfully added']
                        this.color = "success"
                        setTimeout(() => {
                            Events.$emit("reload")
                                this.close()
                            }, 1500)
                    } else {
                        this.errors = res.errors
                        this.color = "error"
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            deleteTodo(id) {
                confirm("Are you sure you want to delete this To-do item?") &&
                this.apiCall("delete-checklist", {task_id: task}).then((res) => {
                    if (res.success){
                        Events.$emit("reload")
                    }
                })
            },
            completeTask() {
                confirm("Are you sure you want to complete this task?") &&
                this.apiCall("complete-task", {task_id: this.$route.params.taskId}).then((res) => {
                    if (res.success){
                        Events.$emit("reload")
                    }
                })
            },
            deleteDoc(id) {
                confirm("Are you sure you want to delete this document?") &&
                this.apiCall("delete-document", {id: id}).then((res) => {
                    if (res.success){
                        Events.$emit("reload")
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

    .scroll {
        max-height: 250px; 
        min-height: 500px; 
        overflow-y: scroll; 
        padding-left: 25px; 
        padding-top: 25px; 
        padding-right: 25px;
    }

</style>