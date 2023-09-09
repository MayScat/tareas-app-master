<template>
    <v-container fluid>
        <v-card>
            <v-app-bar dark class="elevation-2">
                <v-toolbar-title class="d-none d-sm-flex d-sm-none d-md-flex mr-5">
                    <v-icon class="mx-2">mdi-account</v-icon>Tasks: {{tasks.length}}
                </v-toolbar-title>
                <create-task :sel_client="selectedClient" :sel_project="selectedProject"></create-task>
                <v-spacer></v-spacer>
                <v-select :items="clients" hide-details outlined v-model="selectedClient" label="Client"></v-select>
                <v-select :items="projects" hide-details outlined v-model="selectedProject" label="Project"></v-select>
                <v-text-field outlined class="d-none d-sm-flex d-sm-none d-md-flex" v-model="search" append-icon="mdi-magnify"
                    label="Search" single-line hide-details>
                </v-text-field>
            </v-app-bar>
            <v-text-field class="px-4 d-md-none d-sm-flex" v-model="search" append-icon="mdi-magnify" label="Search"
                single-line hide-details></v-text-field>
            <v-data-table :headers="headers" fixed-header :items="tasks" style="cursor: pointer;" :search="search" @click:row="handleClick">
                <template v-slot:item.action="{ item }">
                    <edit-task :task_id="item.task_id"></edit-task>
                </template>
                <template v-slot:item.due_date="{ item }">
                    <span style="font-size: 12px;">{{item.due_date}}</span>
                </template>
                <template v-slot:item.start_date="{ item }">
                    <span style="font-size: 12px;">{{item.start_date}}</span>
                </template>
                <template v-slot:item.delete="{ item }">
                    <v-icon big v-if="item.task_general == 0" color="error darken-2" @click="deleteTask(item.task_id)">mdi-delete</v-icon>
                    <span v-if="item.task_general == 1">-</span>
                </template>
                <template v-slot:item.status="{ item }">
                    <v-chip :color="'#'+item.status_bgcolor" :style="{color: '#'+item.status_fcolor}">{{ item.status }}</v-chip>
                </template>
                <template v-slot:item.type="{ item }">
                    {{item.type_name}}
                </template>
                <template v-slot:item.priority="{ item }">
                    <v-chip small v-if="item.priority == 1" color="#ffa1a1">Critical</v-chip>
                    <v-chip small color="#ffd282" v-else-if="item.priority == 2">High</v-chip>
                    <v-chip small color="#fff9c6" v-else-if="item.priority == 3">Normal</v-chip>
                    <v-chip small color="#d7faff" v-else-if="item.priority == 4">Low</v-chip>
                    <v-chip small color="#f7daff" v-else-if="item.priority == 5">When Possible</v-chip>
                </template>
                <template v-slot:item.owner="{ item }">
                    <v-avatar size="30" :color="item.owner_bg_color">
                        <span class='text-center' :style="{ color: item.owner_f_color, fontSize: '12px' }"><b>{{ item.owner }}</b></span>
                    </v-avatar>
                </template>
            </v-data-table>
        </v-card>
    </v-container>
</template>

<script>
import EditTask from '@/components/EditTaskModal.vue'
import CreateTask from '@/components/CreateTaskModal.vue'
    export default {
        components: {
            EditTask,
            CreateTask
        },
        data() {
            return {
                selectedClient: '',
                selectedStatus: 1,
                statuses: [
                    {
                        text: 'Active',
                        value: 1
                    },
                    {
                        text: 'Inactive',
                        value: 0
                    }
                ],
                clients: [],
                headers: [{
                    text: "Due",
                    align: "left",
                    value: "due_date"
                }, {
                    text: "Start",
                    align: "left",
                    value: "start_date"
                }, {
                    text: "Status",
                    align: "center",
                    value: 'status'
                }, {
                    text: "Client",
                    align: "left",
                    value: "customer",
                }, {
                    text: "Project",
                    align: "left",
                    value: "project"
                }, {
                    text: "edit",
                    align: "center",
                    value: "action"
                }, {
                    text: "Task",
                    align: "left",
                    value: "task"
                }, {
                    text: "Priority",
                    align: "center",
                    value: "priority",
                    width: '10%'
                }, {
                    text: "Type",
                    align: "left",
                    value: "type"
                }, {
                    text: "Owner",
                    align: "center",
                    value: "owner"
                }, {
                    text: "Progress",
                    align: "center",
                    value: 'progress'
                }, {
                    text: "Time",
                    align: "center",
                    value: "time"
                }, {
                    text: "delete",
                    align: "center",
                    value: "delete"
                }],
                tasks: [],
                projects: [],
                selectedProject: '',
                usersdp: [],
                search: ''
            }
        },
        filters: {

        },
        watch: {
            selectedClient() {
                this.$router.replace({ query: { client: this.selectedClient, project: this.selectedProject } })
                this.apiCall('get-tasks-info',{client: this.selectedClient, project: this.selectedProject }).then((res) => {
                    if (res.success) {
                        this.tasks = res.tasks
                    }
                }).catch((error) => {
                    console.log(error)
                })
                this.apiCall('get-projects-drpdwn',{client: this.selectedClient}).then((res) => {
                    if (res.success) {
                        this.projects = []
                        res.projects.forEach(element => {
                            this.projects.push({text: element.project_name, value: element.project_id})
                        });
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            selectedProject() {
                this.$router.replace({ query: { client: this.selectedClient, project: this.selectedProject } })
                this.apiCall('get-tasks-info',{client: this.selectedClient, project: this.selectedProject }).then((res) => {
                    if (res.success) {
                        this.tasks = res.tasks
                    }
                }).catch((error) => {
                    console.log(error)
                })
            }
        },
        beforeMount(){
            this.apiCall("check-perms", {id: 6}).then((res) => {
                if (!res.success){
                    alert('You do not have permission to enter this page.');
                    this.$router.replace('/dashboard');
                }
            })
        },
        mounted() {
            if(!isNaN(this.$route.query.client)) {
                this.selectedClient = this.$route.query.client
            } else {
                this.selectedClient = ''
            }
            if(!isNaN(this.$route.query.project)) {
                this.selectedProject = this.$route.query.project
            } else {
                this.selectedProject = ''
            }
            this.apiCall('get-projects-drpdwn', {client: this.selectedClient}).then((res) => {
                if (res.success) {
                    this.projects = []
                    res.projects.forEach(element => {
                        this.projects.push({text: element.project_name, value: element.project_id})
                    });
                }
            }).catch((error) => {
                    console.log(error)
            })
            this.apiCall('get-clients-dropdown').then((res) => {
                if (res.success) {
                    res.clients.forEach(element => {
                        this.clients.push({text: element.client_name, value: element.id})
                    });
                }
            }).catch((error) => {
                console.log(error)
            })
            Events.$on("reload-edit", () => {
                this.apiCall('get-tasks-info',{client: this.selectedClient, project: this.selectedProject }).then((res) => {
                    if (res.success) {
                        this.tasks = res.tasks
                    }
                }).catch((error) => {
                    console.log(error)
                })
            })
            Events.$on("reload", () => {
                this.apiCall('get-tasks-info',{client: this.selectedClient, project: this.selectedProject }).then((res) => {
                    if (res.success) {
                        this.tasks = res.tasks
                    }
                }).catch((error) => {
                    console.log(error)
                })
            })
            this.apiCall('get-tasks-info',{client: this.selectedClient, project: this.selectedProject }).then((res) => {
                if (res.success) {
                    this.tasks = res.tasks
                }
            }).catch((error) => {
                console.log(error)
            })
        },
        methods: {
            handleClick(value){
                this.$router.push({ name: 'task-edit', params: { taskId: value.task_id }})
            },
            deleteTask(id) {
                event.stopPropagation()
                confirm("Are you sure you want to delete this task?") &&
                this.apiCall("delete-task", {id: id}).then((res) => {
                    if (res.success){
                        Events.$emit("reload")
                    }
                })
            }
        },
    }
</script>

<style>

.row-pointer >>> tbody tr :hover {
  cursor: pointer;
}

thead th {
    white-space: nowrap
}

td {
    white-space: nowrap;
}

</style>