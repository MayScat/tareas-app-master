<template>
<div class="d-inline-block">
    <v-icon color="success darken-2" @click="open()">mdi-pencil</v-icon>
    <v-dialog persistent scrollable v-model="dialog" max-width="80%">
        <v-card>
            <v-app-bar dark dense>
                <v-toolbar-title>
                    Edit Task
                </v-toolbar-title>
            </v-app-bar>
            
            <v-card-text>
                <br>
                <div v-if="errors != []">
                    <v-alert :type="color" v-for="error in errors" :key="error.index">
                        {{error}}
                    </v-alert>
                </div>
                <v-row>
                    <v-col cols="6" sm="6">
                        <v-autocomplete
                                :items="clients" 
                                outlined
                                hide-details
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
                                hide-details
                                color="black"
                                item-text="text"
                                label="Project"
                                v-model="selectedProject"
                            ></v-autocomplete>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field type="text" label="Task Name" outlined hide-details v-model="task_name"></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-select :items="usersdp" label="Assigned to (Owner)" outlined hide-details v-model="selectedOwner"></v-select>
                    </v-col>
                    <v-col cols="2">
                        <v-select label="Priority" :items="prios" outlined hide-details v-model="selectedPrio"></v-select>
                    </v-col>
                    <v-col cols="12" style="margin-top: 15px;">
                        <v-textarea outlined hide-details label="Details" v-model="details"></v-textarea>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col cols="3">
                        <v-select label="Area" :items="areas" outlined hide-details v-model="selectedArea"></v-select>
                    </v-col>
                    <v-col cols="3">
                        <v-select label="Type" :items="types" outlined hide-details v-model="selectedType"></v-select>
                    </v-col>
                    <v-col cols="2">
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
                                @input="menu2 = false"
                                ></v-date-picker>
                            </v-menu>
                        </div>
                    </v-col>
                    <v-col cols="2">
                        <div @click="menu3=true">
                            <v-menu
                                v-model="menu3"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    v-model="date2"
                                    label="ETA"
                                    readonly
                                    clearable
                                    hide-details
                                    append-icon="mdi-calendar"
                                    outlined
                                    v-bind="attrs"
                                    v-on="on"
                                ></v-text-field>
                                </template>
                                <v-date-picker
                                v-model="date2"
                                @input="menu3 = false"
                                ></v-date-picker>
                            </v-menu>
                        </div>
                    </v-col>
                    <v-col cols="2">
                        <v-text-field type="number" outlined label="Est. Hours" hide-details v-model="time"></v-text-field>
                    </v-col>
                    <v-col cols="2">
                        <v-select :items="statuses" label="Status" outlined hide-details v-model="selectedStatus"></v-select>
                    </v-col>
                    <v-col cols="1">
                        <v-text-field type="number" outlined label="Status %" hide-details v-model="pct"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <h3>Collaborators</h3>
                    </v-col>
                    <v-col v-for="user in users" cols="3" :key="user.id">
                        <v-checkbox hide-details v-model="selectedUsers" :value="user.id * 1">
                            <template v-slot:label>
                                <v-avatar size="30" :color="user.bgcolor">
                                    <span class='text-center' :style="{ color: user.fcolor, fontSize: '12px' }"><b>{{ user.code }}</b></span>
                                </v-avatar>
                                    <span style="margin-left: 5px;">{{user.name}}</span>
                            </template>
                        </v-checkbox>
                    </v-col>
                </v-row>
            </v-card-text>
                <v-divider></v-divider>
            <v-card-actions>
                <v-checkbox :disabled="!task.task_rejected" label="Re-send to owner for acceptance" v-model="acceptance"></v-checkbox>
                <v-spacer></v-spacer>
                <v-btn color="error" @click="close">Close</v-btn>
                <v-btn color="success" @click="createUser">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</div>
</template>
<script>
    export default {
        props: {
            task_id: Number
        },
        data() {
            return {
                selectedClient: '',
                selectedPrio: '',
                selectedStatus: '',
                acceptance: false,
                selectedType: '',
                selectedArea: '',
                selectedProject: '',
                details: '',
                hh: 0,
                mm: 0,
                usersdp: [],
                time: '',
                pct: 0,
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
                task: {}
            }
        },
        watch: {
            selectedClient(){
                this.getProjects()
            }
        },
        methods: {
            open(){
                event.stopPropagation()
                this.dialog = true
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
                this.apiCall('get-priorities-dropdown').then((res) => {
                    if (res.success) {
                        this.prios = []
                        res.priorities.forEach(element => {
                            this.prios.push({text: element.value, value: element.id})
                        });
                    }
                }).catch((error) => {
                    console.log(error)
                })
                this.apiCall('get-areas-dropdown').then((res) => {
                    if (res.success) {
                        this.areas = []
                        res.areas.forEach(element => {
                            this.areas.push({text: element.value, value: element.id})
                        });
                    }
                }).catch((error) => {
                    console.log(error)
                })
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
                this.apiCall('get-status-dropdown',{modal: 'edit'}).then((res) => {
                    if (res.success) {
                        this.statuses = []
                        res.statuses.forEach(element => {
                            this.statuses.push({text: element.value, value: element.id})
                        });
                    }
                }).catch((error) => {
                    console.log(error)
                })
                this.apiCall('get-users-dropdown').then((res) => {
                    if (res.success) {
                        this.usersdp = []
                        this.users = []
                        res.users.forEach(element => {
                            this.users.push(element)
                            this.usersdp.push({text: element.code + ' - ' + element.name, value: element.id})
                        });
                    }
                }).catch((error) => {
                    console.log(error)
                })
                this.getTaskInfo()
            },
            getTaskInfo(){
                this.apiCall('get-task-info-edit', {task_id: this.task_id}).then((res) => {
                    if (res.success) {
                        this.task = res.task_info
                        this.selectedClient = this.task.client_id
                        this.selectedProject = this.task.project_id
                        this.selectedPrio = this.task.priority
                        this.selectedStatus = this.task.status
                        this.selectedType = this.task.type
                        this.selectedArea = this.task.area
                        this.details = this.task.task_description
                        this.pct = this.task.progress_pct
                        this.time = this.task.estimated_hrs
                        this.date = this.task.start_date
                        this.date2 = this.task.eta
                        this.task_name = this.task.task_name
                        this.selectedOwner = this.task.owner_id

                        this.task.team_members = this.task.team_members.toString();

                        if(!this.task.team_members.toString().indexOf(',')) {
                            this.selectedUsers = [this.task.team_members]
                        } else {
                            let users_arr = this.task.team_members.split(',');
                            users_arr.forEach(element => {
                                this.selectedUsers.push(element * 1)
                            });
                        }
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
            createUser() {
                this.errors = []
                this.apiCall("edit-task-config", {
                    task_name: this.task_name,
                    acceptance: this.acceptance,
                    client_id: this.selectedClient,
                    project_id: this.selectedProject,
                    priority: this.selectedPrio,
                    type: this.selectedType,
                    area: this.selectedArea,
                    details: this.details,
                    time: this.time,
                    status: this.selectedStatus,
                    pct: this.pct,
                    owner: this.selectedOwner,
                    collabs: this.selectedUsers.join(','),
                    date_start: this.date,
                    date_end: this.date2,
                    task_id: this.task_id
                }).then((res) => {
                    if(res.success){
                        this.errors = ['Task successfully edited']
                        this.color = "success"
                        setTimeout(() => {
                            Events.$emit('reload-edit');
                            this.close()
                        }, 1200)
                    } else {
                        this.errors = res.errors
                        this.color = "error"
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            close(){
                this.dialog = false
                this.errors = []
                this.selectedClient = ''
                this.selectedPrio = ''
                this.selectedStatus = ''
                this.selectedType = ''
                this.selectedArea = ''
                this.selectedProject = ''
                this.details = ''
                this.hh = 0
                this.mm = 0
                this.pct = 0
                this.time = ''
                this.acceptance = false
                this.task_name = ''
                this.selectedUsers = []
                this.selectedOwner = ''
            }
        }
    }
</script>

<style scoped>

</style>