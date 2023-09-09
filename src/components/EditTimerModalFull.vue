<template>
<div style="display: inline-block;">
    <v-icon small color="success" @click="openModal">mdi-pencil</v-icon>
    <v-dialog persistent scrollable v-model="dialog" max-width="850px">
        <v-card>
            <v-list dark>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title class="headline">Edit Timer</v-list-item-title>
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
                        <v-col cols="6" sm="6">
                            
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
                        </v-col>
                        <v-col cols="6" sm="6">
                            
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
                                    v-on:click:append="menu1=true"
                                ></v-text-field>
                                </template>
                                <v-date-picker
                                v-model="date"
                                @input="menu1 = false"
                                ></v-date-picker>
                                </v-menu>
                            </div>
                        </v-col>
                        <v-col cols="2">
                            <v-text-field type="time" label="Start Time" hide-details v-model="time" outlined></v-text-field>
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
                        <v-col cols="2">
                            <v-text-field type="time" label="End Time" hide-details v-model="time2" outlined></v-text-field>
                        </v-col>
                        <v-col cols="12">
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
    export default {
        props: {
            client_id: Number,
            timer_id: Number,
            notes: String,
            project_id: Number,
            tp: Number,
            task_id: Number,
            start_dt: String,
            start_tm: String,
            end_dt: String,
            end_tm: String
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
                type: 0,
                dialog: false,
                selectedClient: '',
                clients: [],
                selectedProject: '',
                projects: [],
                tasks: [],
                types: [],
                selectedTask: '',
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
                color: ''
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
        methods: {
            openModal(){
                setTimeout(() => {
                    this.dialog = true
                }, 300);
                this.getTypes()
                this.getClients()
                this.time = this.start_tm
                this.time2 = this.end_tm
                this.date2 = this.end_dt
                this.date = this.start_dt
                this.type = this.tp
                this.selectedClient = this.client_id
                this.selectedProject = this.project_id
                this.selectedTask = this.task_id
                this.details = this.notes
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
            },
            insertTimer() {
                if(this.time != '' & this.time2 != ''){
                    this.apiCall("edit-timer-config-full", {timer_id: this.timer_id, task_id: this.selectedTask, client_id: this.selectedClient, project_id: this.selectedProject, start_date: this.date, start_time: this.time, end_date: this.date2, end_time: this.time2, type: this.type, details: this.details }).then((response) => {
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