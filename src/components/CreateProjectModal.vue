<template>
    <v-dialog persistent scrollable v-model="dialog" max-width="700px">
        <template v-slot:activator="{ on }" >
            <v-btn color="warning" v-on="on" v-if="!dpd">
                <v-icon>mdi-plus</v-icon> New Project
            </v-btn>
            <v-btn color="warning" v-else v-on="on">
                <v-icon>mdi-plus</v-icon>
            </v-btn>
        </template>
        <v-card>
            <v-app-bar dark dense>
                <v-toolbar-title>
                    New Client
                </v-toolbar-title>
            </v-app-bar>
            
            <v-card-text>
                <br>
                <div v-if="errors != []">
                    <v-alert :type="color" v-for="error in errors" :key="error.index">
                        {{error}}
                    </v-alert>
                </div>
                <v-row dense>
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
                <v-btn color="success" @click="createUser">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
    export default {
        props: {
            sel_client: [Number, String],
            dpd: false
        },
        data() {
            return {
                project_name: '',
                project_description: '',
                project_order: 0,
                selectedClient: '',
                selectedActive: 1,
                dialog: false,
                errors: [],
                address: '',
                clients: [],
                color: '',
                statuses: [{
                    text: "Active",
                    value: 1
                }, {
                    text: "Inactive",
                    value: 2
                }]
            }
        },
        watch: {
            dialog() {
                if(this.dialog == true) {
                    this.selectedClient = this.sel_client
                    this.apiCall('get-clients-dropdown', {tb: 'config'}).then((res) => {
                        if (res.success) {
                            res.clients.forEach(element => {
                            this.clients.push({text: element.client_name, value: element.id})
                            });
                        }
                    }).catch((error) => {
                        console.log(error)
                    })
                    this.apiCall('get-max-project', {client: this.selectedClient}).then((res) => {
                        if (res.success) {
                            this.project_order = res.project_order
                        }
                    }).catch((error) => {
                        console.log(error)
                    })
                }
            }
        },
        methods: {
            createUser() {
                this.errors = []
                this.apiCall("create-project", {
                    project_name: this.project_name,
                    project_description: this.project_description,
                    project_order: this.project_order,
                    active: this.selectedActive,
                    client_id: this.selectedClient
                }).then((res) => {
                    if(res.success){
                        Events.$emit("reload-project", {project_id: res.project_id});
                        this.errors = ['Project successfully added']
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
                this.dialog = false,
                this.errors = []
                this.project_name = ''
                this.project_description = ''
                this.project_order = 0
                this.selectedActive = 1
                this.selectedClient = ''
            }
        }
    }
</script>

<style scoped>

</style>