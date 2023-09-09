<template>
    <v-dialog persistent scrollable v-model="dialog" max-width="700px">
        <template v-slot:activator="{ on }">
            <v-btn color="warning" v-on="on" v-if="!dpd">
                <v-icon>mdi-plus</v-icon>New Client
            </v-btn>
            <v-btn color="warning" v-on="on" v-else>
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
                <v-row>
                    <v-col cols="12" sm="12">
                        <v-text-field label="Client Name" hide-details outlined v-model="client_name"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-text-field label="Client Code" maxlength="8" hide-details outlined v-model="client_code"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12">
                        <v-text-field label="Contact Name" hide-details outlined v-model="contact_name"></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="6">
                        <v-text-field label="Contact Phone" hide-details outlined v-model="contact_phone"></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="6">
                        <v-text-field label="Contact Email" hide-details outlined v-model="contact_email"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12">
                        <v-textarea label="Address Line 1" hide-details type="text" outlined v-model="address1"></v-textarea>
                    </v-col>
                    <v-col cols="12" sm="12">
                        <v-textarea label="Address Line 2 (Optional)" hide-details type="text" outlined v-model="address2"></v-textarea>
                    </v-col>
                    <v-col cols="4" sm="4">
                        <v-text-field label="City" hide-details outlined v-model="city"></v-text-field>
                    </v-col>
                    <v-col cols="4" sm="4">
                        <v-text-field label="State" hide-details outlined v-model="state"></v-text-field>
                    </v-col>
                    <v-col cols="4" sm="4">
                        <v-text-field label="Zipcode" hide-details outlined v-model="zipcode"></v-text-field>
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
            dpd: false
        },
        data() {
            return {
                client_name: '',
                client_code: '',
                contact_name: '',
                contact_phone: '',
                contact_email: '',
                address1: '',
                address2: '',
                city: '',
                state: '',
                zipcode: '',
                dialog: false,
                errors: [],
                color: '',
                selectedActive: 1,
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
            createUser() {
                this.errors = []
                this.apiCall("add-client", {
                    client_name: this.client_name,
                    client_code: this.client_code,
                    contact_name: this.contact_name,
                    contact_phone: this.contact_phone,
                    contact_email: this.contact_email,
                    address1: this.address1,
                    address2: this.address2,
                    city: this.city,
                    state: this.state,
                    zipcode: this.zipcode,
                    active: this.selectedActive
                }).then((res) => {
                    if(res.success){
                        Events.$emit("reload-client", {client_id: res.clientId});
                        this.errors = ['Client successfully added']
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