<template>
<div>
    <v-btn block color="info darken-1" class="mb-1" @click="openModal">
        <v-icon>mdi-plus</v-icon>Add Custom Timer
    </v-btn>
    <v-dialog persistent scrollable v-model="dialog" max-width="850px">
        <v-card>
            <v-list dark>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title class="headline">{{tName}}</v-list-item-title>
                    </v-list-item-content>
                    <v-icon @click="close">mdi-close</v-icon>
                </v-list-item>
            </v-list>
            <v-card-text>
                <br>
                <div v-if="errors != []">
                    <v-alert :type="color" v-for="error in errors" :key="error.index">
                        {{error}}
                    </v-alert>
                </div>
                <v-container fluid>
                    <v-row dense>
                        <v-col cols="12" md="6">
                        <v-menu v-model="menu1" :close-on-content-click="false" max-width="290">
                            <template v-slot:activator="{ on }">
                                <v-text-field outlined
                                    :value="computedDateFormattedMomentjs" label="Start Date" readonly
                                    v-on="on"></v-text-field>
                            </template>
                            <v-date-picker v-model="date" @change="menu1 = false"></v-date-picker>
                        </v-menu>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-time-picker v-model="time" format="ampm" :landscape="$vuetify.breakpoint.smAndUp" ampm-in-title width="200px"></v-time-picker>
                        </v-col>
                        <v-col cols="12" md="6">
                        <v-menu v-model="menu3" :close-on-content-click="false" max-width="290">
                            <template v-slot:activator="{ on }">
                                <v-text-field outlined
                                    :value="computedDateFormattedMomentjs2" label="Stop Date" readonly
                                    v-on="on"></v-text-field>
                            </template>
                            <v-date-picker v-model="date2" @change="menu3 = false"></v-date-picker>
                        </v-menu>
                        <v-select label="Type" outlined :items="types" v-model="type"></v-select>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-time-picker v-model="time2" format="ampm" :landscape="$vuetify.breakpoint.smAndUp" ampm-in-title width="200px"></v-time-picker>
                        </v-col>
                        <v-col cols="12">
                            
                            <small @click="getTimerText"><a>Copy "Previous details" into current details <v-icon
                                        style="font-size: 15px" color="info">mdi-arrow-up-down-bold</v-icon></a></small>
                            <v-textarea label="Details" outlined v-model="details"></v-textarea>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn color="error darken-2" @click="close">Close</v-btn>
                <v-btn color="success darken-2" @click="insertTimer">Start</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</div>
</template>

<script>
    import moment from 'moment'
    export default {
        props: {
            isDisabled: Boolean,
            tName: String,
            tCode: String,
            tSub: String,
            ticket: Number,
            client_id: Number,
            timerDetails: String
        },
        data() {
            return {
                types: [{
                    text: "Programming (General)",
                    value: 12
                }, {
                    text: "Programming (New Feature)",
                    value: 3
                }, {
                    text: "Bugs / Errors",
                    value: 2
                }, {
                    text: "Support",
                    value: 47
                }, {
                    text: "Consulting",
                    value: 1
                }, {
                    text: "Programming (Changes)",
                    value: 4
                }, {
                    text: "Validation",
                    value: 6
                }, {
                    text: "Meeting (Client-Site)",
                    value: 8
                }, {
                    text: "Phone Call / Conference Call",
                    value: 9
                }, {
                    text: "Programming (On-Site)",
                    value: 45
                },{
                    text: "Database / Stored Procedures",
                    value: 46
                }, {
                    text: "Project Management",
                    value: 48
                }, {
                    text: "Diseño Gráfico / Layout",
                    value: 55
                }, {
                    text: "Editorial & Copy",
                    value: 56
                }],
                type: '',
                dialog: false,
                date: new Date().toISOString().substr(0, 10),
                date2: new Date().toISOString().substr(0, 10),
                menu1: false,
                time: '',
                time2: '',
                menu2: false,
                menu3: false,
                menu4: false,
                details: '',
                picker: '',
                errors: [],
                color: ''
            }
        },
        methods: {
            openModal(){
                if(this.ticket == ""){
                    alert("You must select a ticket first")
                } else {
                this.dialog = true
                this.time = moment(new Date()).format("HH:mm")
                this.time2 = moment(new Date()).format("HH:mm")
                }
            },
            close() {
                this.dialog = false
                this.date = new Date().toISOString().substr(0, 10)
                this.date2 = new Date().toISOString().substr(0, 10)
                this.details = ''
                this.errors = []
            },
            insertTimer() {
                console.log(this.ticket)
                this.apiCall("create-custom-timer", {
                    ticket_id: this.ticket,
                    user_id: this.$session.get('user_id'),
                    start_date: this.date + " " + this.time + ":00",
                    stop_date: this.date2 + " " + this.time2 + ":00",
                    details: this.details,
                    type: this.type,
                    client_id: this.client_id
                }).then((response) => {
                    if (response.success) {
                        Events.$emit('startTimer')
                        this.close()
                    } else {
                        this.errors = response.errors
                        this.color = 'error'
                    }
                })
            },
            getTimerText() {
                this.details = this.timerDetails
            }
        },
        computed: {
            computedDateFormattedMomentjs() {
                return this.date ? moment(this.date).format('YYYY-MM-DD') : ''
            },
            computedDateFormattedMomentjs2() {
                return this.date2 ? moment(this.date2).format('YYYY-MM-DD') : ''
            },
        }
    }
</script>

<style scoped>

</style>