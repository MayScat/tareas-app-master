<template>
<div>
     <v-icon @click="openModal" color="info">mdi-plus</v-icon>
    <v-dialog persistent v-model="dialog" max-width="600px">
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
                        <v-text-field label="Client Name" outlined v-model="client_name"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-text-field label="Client Code" outlined v-model="client_code"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-text-field label="Contact" outlined v-model="contact"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12">
                        <v-textarea label="Address(Optional)" type="text" outlined v-model="address"></v-textarea>
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
    </div>
</template>
<script>
    export default {
        data() {
            return {
                client_name: '',
                client_code: '',
                contact: '',
                dialog: false,
                errors: [],
                address: '',
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
        methods: {
            openModal(){
                this.dialog = true
            },
            createUser() {
                this.errors = []
                this.apiCall("add-client", {
                    client_name: this.client_name,
                    client_code: this.client_code,
                    contact: this.contact,
                    address: this.address
                }).then((res) => {
                    if(res.success){
                        this.errors = ['Client successfully added']
                        this.color = "success"
                        setTimeout(() => {
                            Events.$emit("reload-modal", {id: 1, client_id: res.clientId})
                            Events.$emit("reload-list-client", {id: 1, client_id: res.clientId})
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
                this.errors = [],
                this.client_name = '',
                this.client_code = '',
                this.contact = ''
                this.address = ''
            }
        }
    }
</script>

<style scoped>

</style>