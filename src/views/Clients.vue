<template>
    <v-container fluid>
        <v-card>
            <v-app-bar dark class="elevation-2">
                <v-toolbar-title class="d-none d-sm-flex d-sm-none d-md-flex mr-5">
                    <v-icon class="mx-2">mdi-account</v-icon>Clients: {{clients.length}}
                </v-toolbar-title>
                <client-modal></client-modal>
                <v-spacer></v-spacer>
                <v-spacer></v-spacer>
                <v-select :items="statuses" hide-details outlined v-model="selectedStatus" label="Status"></v-select>
                <v-text-field v-model="search" append-icon="mdi-magnify"
                    label="Search" outlined hide-details>
                </v-text-field>
            </v-app-bar>
            <v-text-field class="px-4 d-md-none d-sm-flex" v-model="search" append-icon="mdi-magnify" label="Search"
                single-line hide-details></v-text-field>
            <v-data-table :headers="headers" :items="clients" :search="search">
                <template v-slot:item.action="{ item }">
                    <edit-modal :client="item"></edit-modal>
                </template>
                <template v-slot:item.delete="{ item }">
                    <v-icon big color="error darken-2" @click="deleteClient(item.client_id)">mdi-delete</v-icon>
                </template>
                <template v-slot:item.total_projects="{ item }">
                    <v-btn color="primary" v-if="item.total_projects == 0">Add (+)</v-btn>
                    <router-link v-else :to="{ path: '/config/projects', query: { client: item.client_id } }">{{ item.total_projects }} projects</router-link>
                </template>
                <template v-slot:item.open_tasks="{ item }">
                    <add-task-modal v-if="item.open_tasks == 0" :sel_client="item.client_id"></add-task-modal>
                    <router-link v-else :to="{ path: '/config/tasks', query: { client: item.client_id } }">{{ item.open_tasks }} tasks</router-link>
                </template>
                <template v-slot:item.active="{ item }">
                    <v-chip small v-if="item.active == 1" color="success darken-1" @click="activate(item.client_id,1)">Active</v-chip>
                    <v-chip small color="error darken-2" v-else @click="activate(item.client_id,0)">Inactive</v-chip>
                </template>
            </v-data-table>
        </v-card>
    </v-container>
</template>

<script>
    import ClientModal from '@/components/CreateClientModal.vue'
    import EditModal from '@/components/EditClientModal.vue'
    import AddTaskModal from '@/components/AddTaskModal.vue'
    export default {
        components: {
            ClientModal,
            EditModal,
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
                    text: "Code",
                    value: "client_code"
                }, {
                    text: "Edit",
                    sortable: false,
                    value: "action"
                },
                {
                    text: "Client",
                    value: 'client_name'
                }, {
                    text: "Contact",
                    value: "client_contact_name"
                }, {
                    text: "Phone",
                    value: "client_phone"
                }, {
                    text: "Email",
                    value: "client_contact_email"
                }, {
                    text: "Projects",
                    value: "total_projects",
                    align: "center",
                    sortable: false
                }, {
                    text: "Open tasks",
                    value: "open_tasks",
                    align: "center",
                    sortable: false
                }, {
                    text: "Status",
                    value: "active"
                }, {
                    text: "Delete",
                    sortable: false,
                    value: "delete"
                }],
                clients: [],
                search: ''
            }
        },
        filters: {

        },
        watch: {
            selectedStatus(){
                this.apiCall('get-clients-config', {status: this.selectedStatus}).then((res) => {
                    if (res.success) {
                        this.clients = res.clients
                    }
                }).catch((error) => {
                    console.log(error)
                })
            }
        },
        beforeMount(){
            this.apiCall("check-perms", {id: 4}).then((res) => {
                if (!res.success){
                    alert('You do not have permission to enter this page.');
                    this.$router.replace('/dashboard');
                }
            })
        },
        mounted() {
            Events.$on("reload", () => {
                this.apiCall('get-clients-config', {status: this.selectedStatus}).then((res) => {
                    if (res.success) {
                        this.clients = res.clients
                    }
                }).catch((error) => {
                    console.log(error)
                })
            })
            this.apiCall('get-clients-config', {status: this.selectedStatus}).then((res) => {
                if (res.success) {
                    this.clients = res.clients
                }
            }).catch((error) => {
                console.log(error)
            })
        },
        methods: {
            activate(client_id,status){
                if(status == 1) {
                    confirm("Are you sure you want to deactivate this client, this will deactivate all the other projects related to this client from the system.") &&
                    this.apiCall("toggle-active", {table: 'pass_clients', id: client_id, status: !status * 1}).then((res) => {
                        if (res.success){
                            Events.$emit("reload")
                        }
                    });
                } else {
                    confirm("Are you sure you want to activate this client, this will activate all the other projects related to this client from the system.") &&
                    this.apiCall("toggle-active", {table: 'pass_clients', id: client_id, status: !status * 1}).then((res) => {
                        if (res.success){
                            Events.$emit("reload")
                        }
                    });
                }
            },
            deleteClient(id) {
                confirm("Are you sure you want to delete this client?") &&
                this.apiCall("delete-client", {id: id}).then((res) => {
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