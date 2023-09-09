<template>
<div>
    <v-btn color="warning" @click="openModal" large height="100%">
        <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-dialog persistent scrollable v-model="dialog" max-width="80%">
        <v-card>
            <v-app-bar dark dense>
                <v-toolbar-title>
                    New Task
                </v-toolbar-title>
            </v-app-bar>
            
            <v-card-text>
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
                        <v-checkbox hide-details v-model="selectedUsers" :value="user.id * 1" :disabled="user.id == selectedOwner">
                            <template v-slot:label>
                                <v-avatar size="30" :color="user.bgcolor">
                                    <span class='text-center' :style="{ color: user.fcolor, fontSize: '12px' }"><b>{{ user.code }}</b></span>
                                </v-avatar>
                                    <span style="margin-left: 5px;">{{user.name}}</span>
                            </template>
                        </v-checkbox>
                    </v-col>
                </v-row>
                <br>
                <div v-if="errors != []">
                    <v-alert :type="color" v-for="error in errors" :key="error.index">
                        {{error}}
                    </v-alert>
                </div>
            </v-card-text>
            <v-card-actions>
                <v-checkbox label="Auto Start Timer" v-model="auto_start" v-if="selectedOwner == $session.get('user_id')"></v-checkbox>
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
            sel_client: [Number,String],
            sel_project: [Number,String]
        },
        data() {
            return {
                selectedClient: '',
                selectedPrio: 3,
                selectedStatus: 1,
                selectedType: '',
                selectedArea: 1,
                selectedProject: '',
                details: '',
                auto_start: 0,
                hh: 0,
                mm: 0,
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
                usersdp: [],
                time: 0
            }
        },
        watch: {
            dialog() {
                if(this.dialog == true) {
                    this.selectedClient = this.sel_client
                    this.selectedProject = this.sel_project
                    this.selectedOwner = this.$session.get('user_id')
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
                    this.apiCall('get-status-dropdown').then((res) => {
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
                }
            },
            selectedClient(){
                this.getProjects()
            }
        },
        methods: {
            openModal(){
                Events.$emit('close-modal-timer')
                this.dialog = true
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
                this.apiCall("create-task", {
                    task_name: this.task_name,
                    client_id: this.selectedClient,
                    project_id: this.selectedProject,
                    priority: this.selectedPrio,
                    status: this.selectedStatus,
                    type: this.selectedType,
                    area: this.selectedArea,
                    details: this.details,
                    time: this.time,
                    pct: this.pct,
                    owner: this.selectedOwner,
                    collabs: this.selectedUsers.join(','),
                    date_start: this.date,
                    date_end: this.date2,
                    auto_start: this.auto_start
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
                this.auto_start = 0
                this.hh = 0
                this.mm = 0
                this.pct = 0
                this.task_name = ''
                this.selectedUsers = []
                this.selectedOwner = ''
            }
        }
    }
</script>

<style scoped>

</style>