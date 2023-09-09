<template>
    <v-container fluid>
        <v-card>
            <v-app-bar dark class="elevation-2">
                <v-toolbar-title class="d-none d-sm-flex d-sm-none d-md-flex mr-5">
                    <v-icon class="mx-2">mdi-account</v-icon>Projects: {{projects.length}}
                </v-toolbar-title>
                <project-modal :sel_client="selectedClient"></project-modal>
                <v-spacer></v-spacer>
                <v-select :items="statuses" hide-details outlined v-model="selectedStatus" label="Status"></v-select>
                <v-select :items="clients" outlined hide-details v-model="selectedClient" label="Client"></v-select>
                <v-text-field class="d-none d-sm-flex d-sm-none d-md-flex" v-model="search" append-icon="mdi-magnify"
                    label="Search" outlined hide-details>
                </v-text-field>
            </v-app-bar>
            <v-text-field class="px-4 d-md-none d-sm-flex" v-model="search" append-icon="mdi-magnify" label="Search"
                single-line hide-details></v-text-field>
            <v-data-table :headers="headers" :items="projects" :search="search">
                <template v-slot:item.action="{ item }">
                    <edit-project-modal :project="item"></edit-project-modal>
                </template>
                <template v-slot:item.delete="{ item }">
                    <v-icon v-if="item.project_general == 0" big color="error darken-2" @click="deleteProject(item.project_id)">mdi-delete</v-icon>
                    <span v-if="item.project_general == 1" class="text-center">-</span>
                </template>
                <template v-slot:item.tasks="{ item }">
                    <add-task-modal v-if="item.tasks == 0" :sel_client="item.client_id" :sel_proj="item.project_id"></add-task-modal>
                    <router-link v-else :to="{ path: '/config/tasks', query: { client: item.client_id, project: item.project_id } }">{{ item.tasks }} tasks</router-link>
                </template>
                <template v-slot:item.active="{ item }">
                    <v-chip small v-if="item.active == 1" color="success darken-1" @click="activate(item.project_id,1)">Active</v-chip>
                    <v-chip small color="error darken-2" v-else @click="activate(item.project_id,0)">Inactive</v-chip>
                </template>
            </v-data-table>
        </v-card>
    </v-container>
</template>

<script>
    import ProjectModal from '@/components/CreateProjectModal.vue'
    import EditProjectModal from '@/components/EditProjectModal.vue'
    import AddTaskModal from '@/components/AddTaskModal.vue'
    export default {
        components: {
            ProjectModal,
            EditProjectModal,
            AddTaskModal
        },
        data() {
            return {
                selectedStatus: 1,
                statuses: [
                    {
                        text: 'All',
                        value: ''
                    },
                    {
                        text: 'Active',
                        value: 1
                    },
                    {
                        text: 'Inactive',
                        value: 0
                    }
                ],
                headers: [{
                    text: "Order",
                    value: "project_order",
                    align: "center"
                }, {
                    text: "Edit",
                    sortable: false,
                    value: "action",
                    align: "left"
                },{
                    text: "Client",
                    value: 'client_code',
                    align: "left"
                }, {
                    text: "Project",
                    value: "project_name",
                    align: "left"
                }, {
                    text: "Tasks",
                    value: "tasks",
                    sortable: false,
                    align: "center"
                }, {
                    text: "Status",
                    align:"center",
                    value: "active"
                }, {
                    text: "Delete",
                    sortable: false,
                    value: "delete",
                    align:"center"
                }],
                projects: [],
                clients: [],
                selectedClient: '',
                search: ''
            }
        },
        filters: {

        },
        watch: {
            selectedClient() {
                this.$router.replace({ query: { client: this.selectedClient } })
                this.apiCall('get-projects-config', {client: this.selectedClient, status: this.selectedStatus}).then((res) => {
                    if (res.success) {
                        this.projects = res.projects
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            selectedStatus(){
                this.apiCall('get-projects-config', {client: this.selectedClient, status: this.selectedStatus}).then((res) => {
                    if (res.success) {
                        this.projects = res.projects
                    }
                }).catch((error) => {
                    console.log(error)
                })
            }
        },
        beforeMount(){
            this.apiCall("check-perms", {id: 5}).then((res) => {
                if (!res.success){
                    alert('You do not have permission to enter this page.');
                    this.$router.replace('/dashboard');
                }
            })
        },
        mounted() {
            this.apiCall('get-clients-dropdown').then((res) => {
                if (res.success) {
                    res.clients.forEach(element => {
                        this.clients.push({text: element.client_name, value: element.id})
                    });
                }
            }).catch((error) => {
                console.log(error)
            })

            if(!isNaN(this.$route.query.client)) {
                this.selectedClient = this.$route.query.client * 1
            } else {
                this.selectedClient = ''
            }

            Events.$on("reload", () => {
                this.apiCall('get-projects-config', {client: this.selectedClient, status: this.selectedStatus}).then((res) => {
                    if (res.success) {
                        this.projects = res.projects
                    }
                }).catch((error) => {
                    console.log(error)
                })
            })

            this.apiCall('get-projects-config', {client: this.selectedClient, status: this.selectedStatus}).then((res) => {
                if (res.success) {
                    this.projects = res.projects
                }
            }).catch((error) => {
                console.log(error)
            })
        },
        methods: {
            activate(client_id,status){
                if(status == 1) {
                    confirm("Are you sure you want to deactivate this project, this will deactivate all the other tasks related to this project from the system.") &&
                    this.apiCall("toggle-active", {table: 'pass_clients_projects', id: client_id, status: !status * 1}).then((res) => {
                        if (res.success){
                            Events.$emit("reload")
                        }
                    });
                } else {
                    confirm("Are you sure you want to activate this project, this will activate all the other tasks related to this project from the system.") &&
                    this.apiCall("toggle-active", {table: 'pass_clients_projects', id: client_id, status: !status * 1}).then((res) => {
                        if (res.success){
                            Events.$emit("reload")
                        }
                    });
                }
            },
            deleteProject(id) {
                confirm("Are you sure you want to delete this project?") &&
                this.apiCall("delete-project", {id: id}).then((res) => {
                    if (res.success){
                        Events.$emit("reload")
                    }
                })
            }
        },
    }
</script>

<style scoped>

</style>