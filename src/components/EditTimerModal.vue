<template>
    <div>
        <v-icon color="success darken-2" class="pb-1" style="font-size: 20px;" @click="openDialog(id)">mdi-square-edit-outline</v-icon>
        <v-dialog persistent v-model="dialog" max-width="900px">
            <v-card>
                <v-app-bar dark dense class="elevation-1">
                    <v-toolbar-title>
                        Edit Timer
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-icon @click="close">mdi-close</v-icon>
                </v-app-bar>
                <v-card-text>
                    <div v-if="errors != []">
                        <v-alert :type="color" v-for="error in errors" :key="error.index">
                            {{error}}
                        </v-alert>
                    </div>
                    <v-container fluid>
                        <v-row dense no-gutters>
                            <v-col cols="12" sm="12" md="5">
                                <v-select :items="clients" label="Client" @change="getClientProjects(client)" outlined
                                    v-model="client"></v-select>
                            </v-col>
                            <v-col cols="12" md="1" class="pt-4 ">
                                <add-client-modal></add-client-modal>
                            </v-col>
                            <v-col cols="12" sm="12" md="5">
                                <v-select :items="projects" label="Project" @change="getSubProjects(project)" outlined
                                    v-model="project"></v-select>
                            </v-col>
                            <v-col cols="12" md="1" class="pt-4">
                                <add-project-modal :selectedClient="client"></add-project-modal>
                            </v-col>
                            <v-col cols="12" sm="12" md="5">
                                <v-select :items="subProjects" label="Sub-Project" @change="getSubTickets(subProject)"
                                    outlined v-model="subProject">
                                </v-select>
                            </v-col>
                            <v-col cols="12" sm="12" md="1" class="pt-4">
                                <add-sub-modal :selectedProj="project"></add-sub-modal>
                            </v-col>
                            <v-col cols="12" sm="12" md="5">
                                <v-select :items="tickets" label="Ticket" outlined v-model="ticket"></v-select>
                            </v-col>
                            <v-col cols="12">
                                <v-select label="Type" outlined :items="types" v-model="type"></v-select>
                                <v-textarea label="Details" outlined v-model="details"></v-textarea>
                            </v-col>
                        </v-row>
                        <v-row dense>
                            <v-col cols="12" md="">
                                <div @click="menu1=true">
                                    <v-menu v-model="menu1" :close-on-content-click="false" max-width="290">
                                        <template v-slot:activator="{ on }">
                                            <v-text-field outlined :value="computedDateFormattedMomentjs" label="Start Date"
                                                readonly v-on="on">
                                            </v-text-field>
                                        </template>
                                        <v-date-picker v-model="date" @change="menu1 = false"></v-date-picker>
                                    </v-menu>
                                </div>
                                <v-time-picker v-model="time" format="ampm" :landscape="$vuetify.breakpoint.smAndUp"
                                    ampm-in-title class="ma-0 pa-0" width="180px">
                                </v-time-picker>
                            </v-col>
                            <v-col cols="12" md="6">
                                <div @click="menu3=true">
                                    <v-menu v-if="stopped" v-model="menu3" :close-on-content-click="false" max-width="290">
                                        <template v-slot:activator="{ on }">
                                            <v-text-field outlined :value="computedDateFormattedMomentjs2" label="Stop Date"
                                                readonly v-on="on">
                                            </v-text-field>
                                        </template>
                                        <v-date-picker v-model="date2" @change="menu3 = false"></v-date-picker>
                                    </v-menu>
                                </div>
                                <v-time-picker v-if="stopped" v-model="time2" format="ampm" :landscape="$vuetify.breakpoint.smAndUp"
                                    ampm-in-title width="180px">
                                </v-time-picker>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <div class="flex-grow-1"></div>
                    <v-btn color="error darken-2" @click="close()">Close</v-btn>
                    <v-btn color="success darken-2" @click="edit()">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    import moment from 'moment'
    import AddProjectModal from '@/components/addProjectModal.vue'
    import AddClientModal from '@/components/addClientModal.vue'
    import AddSubModal from '@/components/addSubProjectModal.vue'
    export default {
        components: {
            AddProjectModal,
            AddClientModal,
            AddSubModal
        },
        props: {
            id: Number
        },
        data() {
            return {
                dialog: false,
                name: '',
                details: '',
                code: '',
                errors: [],
                time: new Date(),
                time2: new Date(),
                date: new Date(),
                date2: new Date(),
                menu1: false,
                menu2: false,
                menu3: false,
                menu4: false,
                stopped: false,
                projects: [],
                subProjects: [],
                clients: [],
                tickets: [],
                ticket: '',
                project: '',
                subProject: '',
                client: '',
                type: '',
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
                }, {
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
                current: true,
                currs: [{
                    text: 'Current Time',
                    value: true
                }, {
                    text: 'Custom Time',
                    value: false
                }],
            }
        },
        computed: {
            computedDateFormattedMomentjs() {
                return this.date ? moment(this.date).format('YYYY-MM-DD') : ''
            },
            computedDateFormattedMomentjs2() {
                return this.date2 ? moment(this.date2).format('YYYY-MM-DD') : ''
            }
        },
        mounted(){
            Events.$on("reload-modal", (data) => {
        if(data.id == 1){
          this.getClients()
          this.client = data.client_id
        }
        if(data.id == 2){
          this.getClientProjects(this.client)
          this.project = data.project_id
        }
        if(data.id == 3){
          this.getSubProjects(this.project)
          this.subProject = data.sub_project_id
          this.getSubTickets(data.sub_project_id)
        }
      })
        },
        methods: {
            openDialog() {
                this.dialog = true
                this.apiCall('get-timer-info', {
                    id: this.id
                }).then((response) => {
                    if (response.success) {
                        this.ticket = response.timer.ticket_id
                        this.details = response.timer.details;
                        this.client = response.timer.client_id;
                        this.project = response.timer.project_id;
                        this.subProject = response.timer.sub_project_id;
                        this.getClients()
                        this.getSubProjects(this.project)
                        this.getClientProjects(this.client)
                        this.getSubTickets(response.timer.sub_project_id)
                        this.name = response.timer.ticket_name;
                        this.code = response.timer.code;
                        this.date = moment(response.timer.started_at).format("YYYY-MM-DD");
                        this.time = moment(response.timer.started_at).format("HH:mm");
                        this.type = response.timer.type
                        if (response.timer.stopped_at != "") {
                            this.stopped = true
                            this.time2 = moment(response.timer.stopped_at).format("HH:mm");
                            this.date2 = moment(response.timer.stopped_at).format("YYYY-MM-DD");
                        } else {
                            this.stopped = false
                            this.time2 = moment(new Date()).format("HH:mm");
                            this.date2 = moment(new Date()).format("YYYY-MM-DD");
                        }
                    }
                }).catch((error) => {
                    console.log(error);
                })
                /* this.getSubProjectTIckets(this.id) */
            },
            getClientProjects(client) {
                this.projects = [{
                    text: "Select a Project",
                    value: ""
                }]
                this.subProjects = [{
                    text: "Select a Sub-Project",
                    value: ""
                }]
                this.tickets = [{
                    text: "Select a Ticket",
                    value: ""
                }]
                this.apiCall("get-client-projects", {
                    id: client
                }).then((response) => {
                    if (response.success == true) {
                        response.projects.forEach((element) => {
                            this.projects.push(element)
                        })
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            getSubTickets(sub) {
                this.tickets = [{
                    text: "Select a Ticket",
                    value: ""
                }]
                this.apiCall("get-sub-tickets", {
                    subId: sub
                }).then((response) => {
                    if (response.success == true) {
                        response.tickets.forEach((element) => {
                            this.tickets.push(element)
                        })
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            getClients() {
                this.clients = [{
                    text: "Select a Client",
                    value: ""
                }]
                this.apiCall('get-clients-ids').then((response) => {
                    if (response.success == true) {
                        response.clients.forEach((element) => {
                            this.clients.push(element)
                        })
                    } else {
                        console.log(response)
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            edit() {
                if (this.stopped) {
                    this.apiCall('edit-timer', {
                        id: this.id,
                        started_at: this.date + " " + this.time + ":00",
                        stopped_at: this.date2 + " " + this.time2 + ":00",
                        details: this.details,
                        type: this.type,
                        project: this.project,
                        subProject: this.subProject,
                        client: this.client,
                        ticket: this.ticket
                    }).then((res) => {
                        if (res.success) {
                            Events.$emit('reload')
                            this.dialog = false
                        }
                    }).catch((error) => {
                        console.log(error)
                    })
                } else {
                    this.apiCall('edit-timer', {
                        id: this.id,
                        started_at: this.date + " " + this.time + ":00",
                        stopped_at: "",
                        details: this.details,
                        type: this.type,
                        project: this.project,
                        subProject: this.subProject,
                        client: this.client,
                        ticket: this.ticket
                    }).then((res) => {
                        if (res.success) {
                            Events.$emit('reload')
                            this.dialog = false
                        }
                    }).catch((error) => {
                        console.log(error)
                    })
                }
            },
            getSubProjects(project) {
                this.subProjects = [{
                    text: "Select a Sub-Project",
                    value: ""
                }]
                this.apiCall('get-sub-project-ids', {
                    projectId: project
                }).then((response) => {
                    if (response.success == true) {
                        response.subProjects.forEach((element) => {
                            this.subProjects.push(element)
                        })
                    } else {
                        console.log(response)
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            close() {
                this.dialog = false
                this.project = ''
                this.client = ''
                this.subProject = ''
            }
        }
    }
</script>