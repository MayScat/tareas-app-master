<template>
<div>
    <v-list-item @click="openModal">
        <v-list-item-title>
            <v-icon>mdi-plus</v-icon>New Timer
        </v-list-item-title>
    </v-list-item>
    <v-dialog persistent scrollable v-model="dialog" max-width="850px">
        <v-card>
            <v-list dark>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title class="headline">Create New Timer</v-list-item-title>
                    </v-list-item-content>
                    <v-icon @click="close">mdi-close</v-icon>
                </v-list-item>
            </v-list>
            <v-card-text>
                <br>
                <div v-if="errors != []">
                    <v-alert :type="color" v-for="error in errors" :key="error.index">
                      {{error}}
                    </v-alert>
                </div>
                <v-container fluid>
                    <v-row dense>
                        <v-col cols="12" v-if="prev_details.timer_started_date != undefined">
                            <v-alert color="#d3d3d3" class="box"><p class="mb-0"><span style="font-weight: bold;">Previous Details - {{prev_details.timer_label}}:</span> {{ prev_details.timer_details }}</p></v-alert>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-autocomplete
                                :items="fullTasks" 
                                outlined
                                hide-details
                                placeholder="Choose a Task"
                                item-text="text"
                                label="Task"
                                v-model="selectedTask"
                                @change="prevDetails()"
                            >
                            <template v-slot:append-outer>
                                <add-task ></add-task>
                            </template>
                            </v-autocomplete>
                        </v-col>
<!--                         <v-col cols="6" sm="6">
                            <v-autocomplete
                                :items="clients" 
                                outlined
                                color="black"
                                item-text="text"
                                label="Client"
                                v-model="selectedClient"
                            ></v-autocomplete>
                        </v-col>
                        <v-col cols="6" sm="6">
                            <v-autocomplete
                                :items="projects" 
                                outlined
                                color="black"
                                item-text="text"
                                label="Project"
                                v-model="selectedProject"
                            ></v-autocomplete>
                        </v-col>
                        <v-col cols="6" sm="6">
                            <v-autocomplete
                                :items="tasks" 
                                outlined
                                color="black"
                                item-text="text"
                                label="Task"
                                v-model="selectedTask"
                            ></v-autocomplete>
                        </v-col> -->
                        <v-col cols="12" sm="12">
                            <v-autocomplete
                                :items="types" 
                                outlined
                                color="black"
                                item-text="text"
                                label="Type"
                                v-model="type"
                            ></v-autocomplete>
                        </v-col>
                        <v-col cols="3">
                            <div @click="menu1=true">
                                <v-menu
                                v-model="menu1"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                                >
                                <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    v-model="date"
                                    label="Start Date"
                                    readonly
                                    outlined
                                    append-icon="mdi-calendar"
                                    hide-details
                                    v-bind="attrs"
                                    v-on="on"
                                ></v-text-field>
                                </template>
                                <v-date-picker
                                v-model="date"
                                @input="menu1 = false"
                                ></v-date-picker>
                                </v-menu>
                            </div>
                        </v-col>
                        <v-col cols="3">
                            <v-text-field type="time" label="Start Time" hide-details v-model="time" outlined></v-text-field>
                            <label style="color: blue; text-decoration: underline; cursor: pointer;" @click="lastStop">Last Stop Time</label>
                        </v-col>
                        <v-col cols="3">
                            <div @click="menu2=true">
                                <v-menu
                                v-model="menu2"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                                >
                                <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    v-model="date2"
                                    label="End Date"
                                    readonly
                                    outlined
                                    clearable
                                    append-icon="mdi-calendar"
                                    hide-details
                                    v-bind="attrs"
                                    v-on="on"
                                    v-on:click:append="menu2=true"
                                ></v-text-field>
                                </template>
                                <v-date-picker
                                v-model="date2"
                                @input="menu2 = false"
                                ></v-date-picker>
                                </v-menu>
                            </div>
                        </v-col>
                        <v-col cols="3">
                            <v-text-field type="time" label="End Time" hide-details v-model="time2" outlined></v-text-field>
                            <label style="color: blue; text-decoration: underline; cursor: pointer;" @click="currTime()">Current Time</label>
                        </v-col>
                        <v-col cols="12">
                            <div class="text-right">
                                <v-icon v-if="prev_details.timer_started_date != undefined">mdi-arrow-down-left</v-icon>
                                <label  v-if="prev_details.timer_started_date != undefined" style="color: blue; text-decoration: underline; cursor: pointer;" @click="lastDetails">Copy "Previous Details" here.</label>
                            </div>
                            <v-textarea label="Details" outlined hide-details v-model="details"></v-textarea>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn color="error darken-2" @click="close">Close</v-btn>
                <v-btn color="success darken-2" @click="insertTimer">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</div>
</template>

<script>
    import moment from 'moment'
    import AddTask from '@/components/CreateTaskModalBtnDpd.vue'
    export default {
        components: {
            AddTask
        },
        data() {
            return {
                types: [{
                    text: "Programming (General)",
                    value: 12
                }, {
                    text: "Programming (New Feature)",
                    value: 3
                }, {
                    text: "Bugs / Errors",
                    value: 2
                }, {
                    text: "Support",
                    value: 47
                }, {
                    text: "Consulting",
                    value: 1
                }, {
                    text: "Programming (Changes)",
                    value: 4
                }, {
                    text: "Validation",
                    value: 6
                }, {
                    text: "Meeting (Client-Site)",
                    value: 8
                }, {
                    text: "Phone Call / Conference Call",
                    value: 9
                }, {
                    text: "Programming (On-Site)",
                    value: 45
                },{
                    text: "Database / Stored Procedures",
                    value: 46
                }, {
                    text: "Project Management",
                    value: 48
                }, {
                    text: "Diseño Gráfico / Layout",
                    value: 55
                }, {
                    text: "Editorial & Copy",
                    value: 56
                }],
                type: '',
                dialog: false,
                selectedClient: '',
                clients: [],
                selectedProject: '',
                projects: [],
                tasks: [],
                fullTasks: [],
                types: [],
                selectedTask: '',
                selectedFullTask: '',
                date: '',
                menu1: false,
                time: '',
                date2: '',
                menu2: false,
                time2: '',
                menu2: false,
                details: '',
                picker: '',
                errors: [],
                color: '',
                prev_details: {}
            }
        },
        watch: {
            selectedClient(){
                this.getProjects()
            },
            selectedProject(){
                if(this.selectedClient != '' && this.selectedProject != '') {
                    this.getTasks()
                }
            }
        },
        mounted() {
            Events.$on('close-modal-timer', () => {
                this.dialog = false
            })
        },
        methods: {
            openModal(){
                setTimeout(() => {
                    this.dialog = true
                }, 300);
                this.getNow()
                this.getFullTasks()
                this.getTypes()
                this.getClients()
                this.time = moment(new Date()).format("HH:mm")
                this.date = new Date().toISOString().substr(0, 10)
                this.date2 = new Date().toISOString().substr(0, 10)
                this.type = this.timer_type
            },
            lastDetails(){
                this.details = 'Continue: ' + this.prev_details.timer_details.replace('Continue: ','').trim()
                this.type = this.prev_details.task_type_id
            },
            getClients(){
                this.apiCall('get-clients-dropdown', {tb: 'config'}).then((res) => {
                    if (res.success) {
                        this.clients = []
                        res.clients.forEach(element => {
                            this.clients.push({text: element.client_name, value: element.id})
                        });
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            lastStop(){
                this.apiCall('get-last-stop').then((res) => {
                    if (res.success) {
                        this.date = res.last_stop_date
                        this.time = res.last_stop_time
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            prevDetails(){
                this.apiCall('prev-details', {task_id: this.selectedTask}).then((res) => {
                    if (res.success) {
                        this.prev_details = res.prev_details
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            currTime(){
                this.time2 = moment(new Date()).format("HH:mm");
            },
            getTasks(){
                this.apiCall('get-tasks-dropdown', {tb: 'config', client_id: this.selectedClient, project_id: this.selectedProject}).then((res) => {
                    if (res.success) {
                        this.tasks = []
                        res.tasks.forEach(element => {
                            this.tasks.push({text: element.task_name, value: element.id})
                        });
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            getFullTasks(){
                this.apiCall('get-tasks-full-dropdown',).then((res) => {
                    if (res.success) {
                        this.fullTasks = []
                        res.tasks.forEach(element => {
                            this.fullTasks.push({text: element.task_name, value: element.id})
                        });
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            getProjects(){
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
            getTypes(){
                this.apiCall('get-types-dropdown').then((res) => {
                    if (res.success) {
                        this.types = []
                        res.types.forEach(element => {
                            this.types.push({text: element.value, value: element.id})
                        });
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            close() {
                this.dialog = false
                this.date = new Date().toISOString().substr(0, 10)
                this.date2 = null
                this.type = ''
                this.selectedClient = ''
                this.selectedProject = ''
                this.selectedTask = ''
                this.time2 = ''
                this.details = ''
                this.errors = []
                this.prev_details = {}
            },
            insertTimer() {
                if(this.time != '' & this.time2 != ''){
                    let start_date = new Date(this.date + ' ' + this.time).getTime() / 1000
                    let end_date = new Date(this.date2 + ' ' + this.time2).getTime() / 1000
                    let diff = Math.round(end_date - start_date)
                    if(diff >= 18000){
                        confirm('This timer takes more than 5 hours. Are you sure you want to save it?') && 
                        this.apiCall("create-timer-dropdown", {task_id: this.selectedTask, start_date: this.date, start_time: this.time, end_date: this.date2, end_time: this.time2, type: this.type, details: this.details }).then((response) => {
                            if(response.success) {
                                Events.$emit('reload')
                                this.close()
                            } else {
                                this.errors = response.errors
                                this.color = 'error'
                            }
                        })
                    } else {
                        this.apiCall("create-timer-dropdown", {task_id: this.selectedTask, start_date: this.date, start_time: this.time, end_date: this.date2, end_time: this.time2, type: this.type, details: this.details }).then((response) => {
                            if(response.success) {
                                Events.$emit('reload')
                                this.close()
                            } else {
                                this.errors = response.errors
                                this.color = 'error'
                            }
                        })
                    }
                } else {
                    this.apiCall("create-timer-dropdown", {task_id: this.selectedTask, start_date: this.date, start_time: this.time, end_date: this.date2, end_time: this.time2, type: this.type, details: this.details }).then((response) => {
                        if(response.success) {
                            Events.$emit('reload')
                            this.close()
                        } else {
                            this.errors = response.errors
                            this.color = 'error'
                        }
                    })
                }
            },
            getTimerText() {
                this.details = this.timerDetails
            },
            getNow(){
                this.apiCall("get-server-time", null).then((res) => {
                    if(res.success){
                        this.time = moment(res.now).format("HH:mm")
                    }
                }).catch((error)=>{
                    console.log(error)
                })
            }
        },
        computed: {
            computedDateFormattedMomentjs() {
                return this.date ? moment(this.date).format('YYYY-MM-DD') : ''
            },
        }
    }
</script>

<style scoped>

</style>