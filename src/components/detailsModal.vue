<template>
    <div>
        <a @click="openModal">Details</a>
        <v-dialog persistent v-model="dialog" max-width="600px">
            <v-card>
                <v-app-bar dense dark class="elevation-1">
                    <v-toolbar-title>
                        Ticket Details:
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-icon @click="close">mdi-close</v-icon>
                </v-app-bar>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" md="12" v-for="user in users" :key="user.id">
                            <h2>{{user.name}}</h2>
                            <h4 style="color: green;">{{user.hours | timeForm}} hrs</h4>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import moment from 'moment'
    import numeral from 'numeral'
    export default {
        props: {
            ticket_id: Number
        },
        data() {
            return {
                dialog: false,
                users: []
            }
        },
        mounted() {

        },
        filters: {
            timeForm(value) {
                return numeral(value).format('00:00:00').slice(0, -3);
            },
        },
        methods: {
            openModal() {
                this.dialog = true
                this.getUserDetails(this.ticket_id)
            },
            close() {
                this.dialog = false
                this.users = []
            },
            getUserDetails(ticket) {
                this.apiCall("get-user-details-ticket", {
                    id: ticket
                }).then((res) => {
                    if (res.success) {
                        this.users = res.users
                    }
                }).catch((error) => {
                    console.log(error)
                })
            }
        }
    }
</script>

<style scoped>

</style>