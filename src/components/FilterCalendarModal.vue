<template>
    <div>
        <v-btn text @click="openModal">
            <v-icon class="mx-2">mdi-filter</v-icon>Filter
        </v-btn>
        <v-dialog persistent v-model="dialog" max-width="800px">
            <v-card>
                <v-app-bar>
                    <v-toolbar-title>
                        <span class="headline">Filter:</span>
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
                        <v-row>
                            <v-col cols="12" md="12" sm="12" xs="12">
                                <v-select outlined label="Clients" :items="clients"
                                    v-model="selectedClient">

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
                                <v-select outlined label="Users" :items="users" v-model="selectedUser">

                                </v-select>
                            </v-col>
                            <v-col cols="12" md="6" sm="12" xs="12" class="py-0">
                                <v-select :items="months" label="Month" outlined v-model="selectedMonth"></v-select>
                            </v-col>
                            <v-col cols="12" md="6" sm="12" xs="12" class="py-0">
                                <v-select :items="years" label="Year" outlined v-model="selectedYear"></v-select>
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
    import moment from 'moment'
    export default {
        data() {
            return {
                dialog: false,
                errors: [],
                clients: [],
                color: '',
                menu1: false,
                menu2: false,
                date1: "",
                date2: "",
                subProjects: [],
                months: [{
                    text: "January",
                    value: "01"
                }, {
                    text: "February",
                    value: "02"
                }, {
                    text: "March",
                    value: "03"
                }, {
                    text: "April",
                    value: "04"
                }, {
                    text: "May,",
                    value: "05"
                }, {
                    text: "June",
                    value: "06"
                }, {
                    text: "July",
                    value: "07"
                }, {
                    text: "August",
                    value: "08"
                }, {
                    text: "September",
                    value: "09"
                }, {
                    text: "October",
                    value: "10"
                }, {
                    text: "November",
                    value: "11"
                }, {
                    text: "December",
                    value: "12"
                }],
                years: ["2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"],
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
                selectedMonth: '',
                selectedYear: '',
                selectedClient: '',
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
            getClients() {
                this.apiCall("get-clients-ids", null).then((response) => {
                    if (response.success == true) {
                        this.clients = response.clients
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            search() {
                this.errors = []
                if (this.selectedMonth == "" || this.selectedYear == "") {
                    this.selectedMonth = moment(new Date()).format("MM")
                    this.selectedYear = moment(new Date()).format("YYYY")
                }
                Events.$emit('Filter', {
                    isFilter: true,
                    user_id: this.selectedUser,
                    project_id: this.selectedProj,
                    type_id: this.selectedType,
                    sub_id: this.selectedSub,
                    month: this.selectedMonth,
                    year: this.selectedYear
                })
                this.dialog = false
            }
        }
    }
</script>

<style scoped>

</style>