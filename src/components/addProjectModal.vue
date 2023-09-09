<template>
    <div>
        <v-icon @click="openModal" color="info">mdi-plus</v-icon>
        <v-dialog persistent v-model="dialog" max-width="600px">
            <v-card>
                <v-app-bar dense dark>
                    <v-toolbar-title>New Project</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-icon @click="close">mdi-close</v-icon>
                </v-app-bar>
                <v-card-text>
                    <div v-if="errors != []">
                        <v-alert :type="color" v-for="error in errors" :key="error.index">
                            {{error}}
                        </v-alert>
                    </div>
                    <v-container>
                        <v-row dense>
                            <v-col cols="12" sm="12" md="6">
                                <v-text-field label="Project Name" outlined required v-model="name"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="6">
                                <v-text-field label="Project Code" outlined v-model="code"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-textarea label="Description" outlined v-model="description"></v-textarea>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <div class="flex-grow-1"></div>
                    <v-btn color="error darken-2" @click="close()">Close</v-btn>
                    <v-btn color="success darken-2" @click="insertProject()">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    export default {
        props: {
            selectedClient: Number
        },
        data() {
            return {
                dialog: false,
                code: '',
                clients: [],
                name: '',
                description: '',
                errors: [],
                color: ''
            }
        },
        methods: {
            openModal() {
                if(this.selectedClient == ""){
                    alert("Please select a client first")
                } else {
                this.dialog = true
                this.getClients()
                }
            },
            insertProject() {
                this.apiCall("insert-project", {
                    code: this.code,
                    name: this.name,
                    description: this.description,
                    client_id: this.selectedClient,
                    admin_by: this.$session.get('user_id')
                }).then((response) => {
                    if (response.success == true) {
                        this.color = 'success'
                        this.errors = ['Project has been succesfully added.']
                        setTimeout(() => {
                            this.close()
                            Events.$emit('reload-modal', {id: 2, project_id: response.proj})
                            Events.$emit('reload-list-proj', {id: 2, project_id: response.proj})
                        }, 950);
                    } else {
                        this.color = 'error'
                        this.errors = response.errors
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            close() {
                this.dialog = false
                this.code = ''
                this.name = ''
                this.description = ''
                this.client = ''
                this.errors = []
                this.color = ''
            }
        }
    }
</script>