<template>
<div class="d-inline-block">
    <v-icon color="success darken-2" @click="getUser">mdi-pencil</v-icon>
    <v-dialog persistent v-model="dialog" scrollable max-width="700px">
        <v-card>
            <v-app-bar dark>
                <v-toolbar-title>
                    Edit Client:
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
                <v-btn color="success" @click="editUser()">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</div>
</template>
<script>
    export default {
        props: {
            client: Object,
        },
        data() {
            return {
                errors: [],
                color: '',
                client_name: '',
                client_code: '',
                contact_name: '',
                contact_phone: '',
                zipcode: '',
                contact_email: '',
                address1: '',
                address2: '',
                city: '',
                state: '',
                tree: [],
                id: '',
                dialog: false,
                selectedActive: 1,
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
                this.id = this.client.client_id
                this.address1 = this.client.address1
                this.address2 = this.client.address1
                this.city = this.client.address1
                this.state = this.client.address1
                this.zipcode = this.client.address1
                this.client_name = this.client.client_name
                this.client_code = this.client.client_code
                this.contact_phone = this.client.client_phone
                this.contact_email = this.client.client_contact_email
                this.contact_name = this.client.contact_name,
                this.selectedActive = this.client.active
            },
            editUser(){
                this.apiCall("edit-client", {
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
                    active: this.selectedActive,
                    id: this.id
                }).then((res) => {
                    if(res.success){
                        this.errors = ['Client successfully edited.']
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
                this.firstName = ''
                this.companyName = ''
                this.lastName = ''
                this.email = ''
                this.password = ''
                this.selectedActive = ''
                this.selectedType = ''
                this.id = ''
                this.address = ''
                this.phone = ''
            }
        }
    }
</script>

<style scoped>

</style>