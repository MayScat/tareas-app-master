<template>
    <div>
        <a @click="open">
            <v-btn color="info"><v-icon>mdi-cash-usd-outline</v-icon>Complete Billing</v-btn>
        </a>
        <v-dialog v-model="dialog" persistent width="600px">
            <v-card>
                <v-app-bar dense dark>
                    <v-toolbar-title>Complete Billing: {{client_name}}</v-toolbar-title>
                </v-app-bar>
                <div v-if="errors != []">
                    <v-alert :type="color" v-for="error in errors" :key="error.index">
                        {{error}}
                    </v-alert>
                </div>
                <v-card-text class="mt-2">
                    <v-row dense>
                        <v-col cols="12" md="12">
                            <v-text-field label="Title" outlined v-model="title"></v-text-field>
                        </v-col>
                        <!-- <v-col cols="12" md="6">
                            <v-text-field type='date' label="Date From" outlined v-model="date_to"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field type='hidden' label="Date To" outlined v-model="date_from"></v-text-field>
                        </v-col> -->
                        <v-col cols="12" md="12">
                            <v-textarea label="Notes" outlined :value="notes"></v-textarea>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="close" color="error darken-2">Close</v-btn>
                    <v-btn @click="createBilling" color="success darken-2">Create Bill</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import numeral from 'numeral'
    export default {
        props: {
            timer_ids: Array,
            client: Number,
            date_f: String,
            date_t: String
        },
        filters: {
            timeForm(value) {
                return numeral(value).format('00:00:00').slice(0, -3);
            }
        },
        data() {
            return {
                clients: [],
                dialog: false,
                notes: '',
                client_name: '',
                title: '',
                selectedClient: '',
                errors: [],
                color: '',
                date_from: '',
                date_to: '',
                selectedTimers: [],
                totalHours: 0
            }
        },
        methods: {
            open() {
                this.dialog = true
                this.getClients()
                this.getClientInfo(this.client)
            },
            close() {
                this.dialog = false
                this.errors = []
                this.color = ''
                this.selectedClient = ''
            },
            getClients() {
                this.apiCall("get-clients-ids", null).then((res) => {
                    if (res.success == true) {
                        this.clients = res.clients
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            getClientInfo(client){
                this.apiCall("get-client-name", {id: client}).then((res) => {
                    if (res.success == true) {
                        this.client_name = res.client_name
                        console.log(this.date_f)
                        this.title = res.client_name + ' (' + this.date_f + ' - ' + this.date_t + ')'
                        this.date_from = this.date_f
                        this.date_to = this.date_t
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            createBilling() {
                this.apiCall('create-billing', {
                    client_id: this.client,
                    title: this.title,
                    notes: this.notes,
                    from_date: this.date_from,
                    to_date: this.date_to,
                    timer_ids: this.timer_ids.join(',')
                }).then((res) => {
                    if (res.success) {
                        this.errors = ['Bill successfully created.']
                        this.color = "success"
                        setTimeout(() => {
                            this.close()
                        }, 1500)
                        this.$router.push('/Billing')
                    } else {
                        this.errors = res.errors
                        this.color = "error"
                    }
                }).catch((error) => {
                    console.log(error)
                })
            }
        },
    }
</script>

<style scoped>

</style>