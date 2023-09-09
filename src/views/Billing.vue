<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12" md="8" sm="12">
                <v-card>
                    <v-app-bar dark>
                        <v-toolbar-title>
                            <v-icon class="mx-1">mdi-cash-usd-outline</v-icon>
                            Invoices
                        </v-toolbar-title>
                        <v-spacer></v-spacer>
                    </v-app-bar>
                    <v-text-field prepend-icon="mdi-magnify" label="Search" v-model="search"></v-text-field>
                    <v-data-table :headers="headers" :items="invoices" :search="search.trim()">
                        <template v-slot:item.billing_date="{ item }">
                            {{item.billing_date | dateForm }}
                        </template>
                        <template v-slot:item.action="{ item }">
                            <v-btn color="info" small @click="getTickets(item)"><v-icon>mdi-eye</v-icon></v-btn>
                            <v-icon style="font-size: 35px;" color="red" @click="getPDF(item)">mdi-file-pdf-box</v-icon>
                            <v-icon style="font-size: 35px;" color="warning" @click="deleteInvoice(item)">mdi-delete</v-icon>
                        </template>
                    </v-data-table>
                </v-card>
            </v-col>
            <v-col cols="12" md="4" sm="12">
                <v-card class="elevation-0">
                    <v-app-bar dense dark>
                        <v-toolbar-title>
                            <v-icon class="mx-1">mdi-cash-usd-outline</v-icon>
                            Invoice Details
                        </v-toolbar-title>
                        <v-spacer></v-spacer>
                        <span v-if="billNum != ''">Billing Number: #{{billNum}}</span>
                    </v-app-bar>
                    <v-list v-if="tickets.length != 0">
                        <v-container>
                            <small>By User: </small>
                            <v-chip small color="teal" dark v-for="user in user_hours" :key="user.id"
                                class="d-inline-block mr-1">{{user.user_name}} ({{user.total_hours | timeForm}} hrs)
                            </v-chip>
                        </v-container>
                        <v-container>
                            <small>By Type: </small>
                            <v-chip small color="warning" v-for="type in type_hours" :key="type.id"
                                class="d-inline-block mr-1">{{type.id | projType}} ({{type.total_hours | timeForm}} hrs)
                            </v-chip>
                        </v-container>
                        <v-expansion-panels class="elevation-0" accordion focusable>
                            <v-expansion-panel v-for="ticket in tickets" :key="ticket.id">
                                <v-expansion-panel-header>
                                    <div>
                                        <small>Project: <a>{{ticket.proj_name}} ({{ticket.hours | timeForm}}hrs)</a></small>
                                        <br>
                                        <small>Task: <a>{{ticket.ticket_name}}</a></small>
                                    </div>
                                </v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <v-list>
                                        <v-list-item three-line v-for="timer in ticket.timers" :key="timer.id">
                                            <v-list-item-content>
                                                <v-list-item-title><small>Type: <a>{{timer.type}}
                                                            ({{timer.total_hours | timeForm}}hrs)</a></small>
                                                </v-list-item-title>
                                                <v-list-item-subtitle>
                                                    <small style="font-weight: 700;">{{timer.user}} |
                                                        {{timer.started_at | dateForm}} <v-icon small>
                                                            mdi-arrow-right-thick</v-icon>
                                                        {{timer.stopped_at | dateForm}}</small>
                                                </v-list-item-subtitle>
                                                <v-list-item-subtitle class="text-wrap">
                                                    <small>{{timer.details}}</small>
                                                </v-list-item-subtitle>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-list>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </v-list>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import moment from 'moment'
    import numeral from 'numeral'
    import axios from 'axios'
    export default {
        data() {
            return {
                tickets: [],
                invoices: [],
                search: '',
                billNum: '',
                user_hours: [],
                type_hours: [],
                data: null,
                headers: [{
                        text: "Billing",
                        value: "billing_number"
                    },
                    {
                        text: "Title",
                        value: "title"
                    },
                    {
                        text: "Billed to",
                        value: "client_name"
                    }, {
                        text: "Date Billed",
                        value: "billing_date"
                    }, {
                        text: "Action",
                        value: "action"
                    }
                ]
            }
        },
        mounted() {
            this.apiCall("get-invoices").then((res) => {
                    if (res.success) {
                        this.invoices = res.invoices
                    }
                }).catch((error) => {
                    console.log(error)
                })
            Events.$on('reload', () => {
                this.tickets = []
                this.billNum = ''
                this.apiCall("get-invoices").then((res) => {
                    if (res.success) {
                        this.invoices = res.invoices
                    }
                }).catch((error) => {
                    console.log(error)
                })
            })
        },
        methods: {
            deleteInvoice(item) {
                confirm('Are you sure you want to delete this invoice?') &&
                    this.apiCall('delete-invoice', {
                        id: item.id
                    }).then(res => {
                        if (res.success) {
                            Events.$emit('reload')
                        }
                    }).catch(error => {
                        console.log(error)
                    })
            },
            getTickets(data) {
                this.apiCall('get-billed-tickets', {
                    id: data.id
                }).then((res) => {
                    if (res.success) {
                        this.tickets = res.tickets
                        this.billNum = data.billing_number
                        this.user_hours = res.user_hours
                        this.type_hours = res.hours_type
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            getPDF(item) {
                axios({
                    url: 'https://pass2.design2net.com/api/create-invoice.html?ID=' + item.billing_number,
                    method: 'GET',
                    responseType: 'blob',
                }).then((response) => {
                    var fileURL = window.URL.createObjectURL(new Blob([response.data]));
                    var fileLink = document.createElement('a');

                    fileLink.href = fileURL;
                    fileLink.setAttribute('download', "Invoice-" + item.billing_number + ".pdf");
                    document.body.appendChild(fileLink);

                    fileLink.click();
                });
            }
        },
        components: {

        },
        filters: {
            dateForm(value) {
                return moment(value).format("MM/DD/YYYY h:mm A")
            },
            timeForm(value) {
                return numeral(value).format('00:00:00').slice(0, -3);
            },
        }
    }
</script>

<style scoped>

</style>