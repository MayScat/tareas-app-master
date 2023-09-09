<template>
    <v-container fluid>
        <v-card>
            <v-app-bar dense dark class="elevation-2">
                <v-toolbar-title class="d-none d-sm-flex d-sm-none d-md-flex mr-5">
                    <v-icon class="mx-2">mdi-account</v-icon>Users: {{users.length}}
                </v-toolbar-title>
                <user-modal></user-modal>
                <v-spacer></v-spacer>
                <v-spacer></v-spacer>
                <v-text-field class="d-none d-sm-flex d-sm-none d-md-flex" v-model="search" append-icon="mdi-magnify"
                    label="Search" single-line hide-details>
                </v-text-field>
            </v-app-bar>
            <v-text-field class="px-4 d-md-none d-sm-flex" v-model="search" append-icon="mdi-magnify" label="Search"
                single-line hide-details></v-text-field>
            <v-data-table :headers="headers" :items="users" :search="search">
                <template v-slot:item.delete="{ item }">
                    <v-icon big color="error darken-2" @click="deleteUser(item.id)">mdi-delete</v-icon>
                </template>
                <template v-slot:item.edit="{ item }">
                    <edit-user-modal :user="item"></edit-user-modal>
                </template>
                <template v-slot:item.code="{ item }">
                    <v-avatar size="30" :color="item.bColor">
                        <span class='text-center' :style="{ color: item.fColor, fontSize: '12px' }"><b>{{ item.code }}</b></span>
                    </v-avatar>
                </template>
                <template v-slot:item.oof="{ item }">
                    <out-of-office :user_id="item.id" :oof="item.oof" :oof_hours="item.oof_hours"></out-of-office>
                </template>
                <template v-slot:item.reset_pass="{ item }">
                    <v-icon class="text-center" big color="warning darken-2" @click="updatePass(item.id)">mdi-refresh</v-icon>
                </template>
                <template v-slot:item.active="{ item }">
                    <v-chip small v-if="item.active == 1" color="success darken-1" @click="activate(item.id,1)">Active</v-chip>
                    <v-chip small color="error darken-2" v-else @click="activate(item.id,0)">Inactive</v-chip>
                </template>
            </v-data-table>
        </v-card>
    </v-container>
</template>

<script>
    import UserModal from '@/components/CreateUserModal.vue'
    import EditUserModal from '@/components/EditUserModal.vue'
    import OutOfOffice from '@/components/OutOfOfficeList.vue'
    export default {
        components: {
            UserModal,
            EditUserModal,
            OutOfOffice
        },
        data() {
            return {
                headers: [{
                    text: "Code",
                    align: "center",
                    value: "code"
                },{
                    text: "Name",
                    value: "name"
                },{
                    text: "Edit",
                    align: "center",
                    value: "edit"
                },{
                    text: "Email",
                    value: "email"
                },{
                    text: "Out of Office",
                    value: "oof",
                    sortable: false
                },{
                    text: "Active",
                    value: "active"
                },
                {
                    text: "Last Login",
                    value: "last_login",
                    sortable: false
                },
                {
                    text: "Reset Password",
                    value: "reset_pass",
                    align: "center",
                    sortable: false
                },{
                    text: "Delete",
                    value: "delete",
                    align: "center",
                    sortable: false
                }],
                users: [],
                search: ''
            }
        },
        filters: {

        },
        beforeMount(){
            this.apiCall("check-perms", {id: 3}).then((res) => {
                if (!res.success){
                    alert('You do not have permission to enter this page.');
                    this.$router.replace('dashboard');
                }
            })
        },
        mounted() {
            Events.$on("reload-table", () => {
                this.apiCall('get-users', null).then((res) => {
                    if (res.success) {
                        this.users = res.users
                    }
                }).catch((error) => {
                    console.log(error)
                })
            })
            this.apiCall('get-users').then((res) => {
                if (res.success) {
                    this.users = res.users
                }
            }).catch((error) => {
                console.log(error)
            })
        },
        methods: {
            activate(user_id,status){
                this.apiCall("toggle-active", {table: 'pass_team_users', id: user_id, status: !status * 1}).then((res) => {
                    if (res.success){
                        Events.$emit("reload-table")
                    }
                });
            },
            deleteUser(id) {
                confirm("Are you sure you want to delete this user?") &&
                this.apiCall("delete-user", {id: id}).then((res) => {
                    if (res.success){
                        Events.$emit("reload-table")
                    }
                })
            },
            updatePass(id) {
                confirm("Are you sure you want to reset this user's password?") &&
                this.apiCall("update-password", {id: id}).then((res) => {
                    if (res.success){
                        Events.$emit("reload-table")
                    }
                })
            }
        },
    }
</script>

<style scoped>

</style>