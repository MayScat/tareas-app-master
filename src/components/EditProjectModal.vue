<template>
<div class="d-inline-block">
    <v-icon color="success darken-2" @click="getUser">mdi-pencil</v-icon>
    <v-dialog persistent v-model="dialog" scrollable max-width="700px">
        <v-card>
            <v-app-bar dark>
                <v-toolbar-title>
                    Edit Project:
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-icon @click="close">mdi-close</v-icon>
            </v-app-bar>
            <v-card-text>
                <br>
                <div v-if="errors != []">
                    <v-alert :type="color" v-for="error in errors" :key="error.index">
                        {{error}}
                    </v-alert>
                </div>
                <v-row>
                    <v-col cols="12" sm="12">
                        <v-select label="Client" :items="clients" outlined hide-details v-model="selectedClient"></v-select>
                    </v-col>
                    <v-col cols="12" sm="12">
                        <v-text-field label="Project Name" hide-details outlined v-model="project_name"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12">
                        <v-textarea label="Project Description" hide-details outlined v-model="project_description"></v-textarea>
                    </v-col>
                    <v-col cols="4" sm="4">
                        <v-text-field label="Project Order" type="number" outlined hide-details v-model="project_order"></v-text-field>
                    </v-col>
                    <v-col cols="4" sm="4">
                        <v-select :items="statuses" outlined hide-details v-model="selectedActive"></v-select>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" @click="close">Close</v-btn>
                <v-btn color="success" @click="editUser()">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</div>
</template>
<script>
    export default {
        props: {
            project: Object,
        },
        data() {
            return {
                errors: [],
                color: '',
                dialog: false,
                project_name: '',
                project_description: '',
                project_order: 0,
                selectedClient: '',
                selectedActive: 1,
                clients: [],
                id: '',
                statuses: [{
                    text: "Active",
                    value: 1
                }, {
                    text: "Inactive",
                    value: 2
                }],
                types: [{
                    text: "Admin",
                    value: 1
                }, {
                    text: "User",
                    value: 2
                }, {
                    text: "Client",
                    value: 3
                }]
            }
        },
        methods: {
            getUser(){
                this.dialog = true
                this.id = this.project.project_id
                this.project_name = this.project.project_name
                this.project_description = this.project.project_description
                this.project_order = this.project.project_order
                this.selectedClient = this.project.client_id * 1
                this.apiCall('get-clients-dropdown', {tb: 'config'}).then((res) => {
                    if (res.success) {
                        res.clients.forEach(element => {
                        this.clients.push({text: element.client_name, value: element.id})
                        });
                    }
                }).catch((error) => {
                        console.log(error)
                })
            },
            editUser(){
                this.apiCall("edit-project-config", {
                    project_name: this.project_name,
                    project_description: this.project_description,
                    project_order: this.project_order,
                    active: this.selectedActive,
                    client_id: this.selectedClient,
                    id: this.id
                }).then((res) => {
                    if(res.success){
                        this.errors = ['Project successfully edited.']
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
            }
        }
    }
</script>

<style scoped>

</style>