<template>
    <div>
        <v-btn text @click="openModal">
            <v-icon class="mx-2">mdi-filter</v-icon>Filter
        </v-btn>
        <v-dialog persistent v-model="dialog" max-width="800px">
            <v-card>
                <v-card-title>
                    <span class="headline">Filter:</span>
                </v-card-title>
                <v-card-text>
                    <div v-if="errors != []">
                        <v-alert :type="color" v-for="error in errors" :key="error.index">
                            {{error}}
                        </v-alert>
                    </div>
                    <v-container fluid>
                        <v-row>
                            <v-col cols="12" md="12" sm="12" xs="12">
                                <v-select outlined label="Client" :items="clients" v-model="selectedClient">

                                </v-select>
                            </v-col>
                            <v-col cols="12" md="6" sm="12" xs="12">
                                <v-select outlined label="Projects" @change="getSubProjects" :items="projs"
                                    v-model="selectedProj">

                                </v-select>
                            </v-col>
                            <v-col cols="12" md="6" sm="12" xs="12">
                                <v-select outlined label="Sub-Projects" :items="subProjects" v-model="selectedSub">

                                </v-select>
                            </v-col>
                            <v-col cols="12" md="6" sm="12" xs="12">
                                <v-select outlined label="Types" :items="types" v-model="selectedType">

                                </v-select>
                            </v-col>
                            <v-col cols="12" md="6" sm="12" xs="12">
                                <v-select outlined label="Users" :items="users" v-model="selectedUser"></v-select>
                            </v-col>
                            <v-col cols="12" md="6" sm="12" xs="12" class="py-0">
                                <v-menu v-model="menu1" :close-on-content-click="false" :nudge-right="40"
                                    transition="scale-transition" offset-y min-width="290px">
                                    <template v-slot:activator="{ on }">
                                        <v-text-field clearable v-model="date1" label="From:" prepend-icon="mdi-calendar" readonly
                                            v-on="on"></v-text-field>
                                    </template>
                                    <v-date-picker v-model="date1" @input="menu1 = false"></v-date-picker>
                                </v-menu>
                            </v-col>
                            <v-col cols="12" md="6" sm="12" xs="12" class="py-0">
                                <v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40"
                                    transition="scale-transition" offset-y min-width="290px">
                                    <template v-slot:activator="{ on }">
                                        <v-text-field clearable v-model="date2" label="To:" prepend-icon="mdi-calendar" readonly
                                            v-on="on"></v-text-field>
                                    </template>
                                    <v-date-picker v-model="date2" @input="menu2 = false"></v-date-picker>
                                </v-menu>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <div class="flex-grow-1"></div>
                    <v-btn color="red darken-1" dark @click="close()">Close</v-btn>
                    <v-btn color="info darken-1" @click="search()">Search</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                dialog: false,
                errors: [],
                color: '',
                menu1: false,
                menu2: false,
                date1: "",
                date2: "",
                subProjects: [],
                projs: [{
                    text: "Select a Project",
                    value: ""
                }],
                users: [{
                    text: "Select an User",
                    value: ""
                }],
                selectedSub: '',
                selectedProj: '',
                selectedType: '',
                selectedUser: '',
                selectedClient: '',
                clients: [],
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
                }]
            }
        },
        methods: {
            openModal() {
                this.dialog = true
                this.getProjects()
                this.getUsers()
                this.getClients()
            },
            close() {
                this.dialog = false
                this.selectedSub = ''
                this.selectedProj = ''
                this.selectedType = ''
                this.selectedUser = ''
                this.selectedClient = ''
            },
            getClients() {
                this.apiCall("get-clients-ids", null).then((response) => {
                    if (response.success == true) {
                        this.clients = response.clients
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            getSubProjects(project) {
                this.apiCall('get-sub-project-ids', {
                    projectId: project
                }).then((response) => {
                    if (response.success == true) {
                        this.subProjects = response.subProjects
                    } else {
                        console.log(response)
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            getProjects() {
                this.selectedSub = ''
                this.apiCall("get-projects", null).then((response) => {
                    if (response.success == true) {
                        for (let i = 0; i < response.projects.length; i++) {
                            this.projs.push({
                                text: response.projects[i].name + " (" + response.projects[i].code +
                                    ")",
                                value: response.projects[i].id
                            })
                        }
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            getUsers() {
                this.apiCall('get-user-ids', null).then((res) => {
                    for (let i = 0; i < res.users.length; i++) {
                        this.users.push(res.users[i])
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            search() {
                this.errors = []
                if (this.date1 != '' && this.date2 != '' && new Date(this.date2) < new Date(this.date1)) {
                    this.errors = ['To date cannot be earlier than From date.']
                    this.color = 'error'
                    return
                }
                Events.$emit('FilterOn', {
                    isFilter: true,
                    client_id: this.selectedClient,
                    user_id: this.selectedUser,
                    project_id: this.selectedProj,
                    type_id: this.selectedType,
                    sub_id: this.selectedSub,
                    start_date: this.date1,
                    stop_date: this.date2
                })
                this.dialog = false
            }
        }
    }
</script>

<style scoped>

</style>