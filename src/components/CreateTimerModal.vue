<template>
<div>
    <v-btn block color="success darken-2" class="mb-1" :disabled="isDisabled" @click="openModal">
        Start
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
                    <v-row>
                        <v-col cols="12" md="6">
                            <div @click="menu1=true">
                                <v-menu v-model="menu1" :close-on-content-click="false" max-width="290">
                                    <template v-slot:activator="{ on }">
                                        <v-text-field outlined
                                            :value="computedDateFormattedMomentjs" clearable label="Start Date" readonly
                                            v-on="on"></v-text-field>
                                    </template>
                                    <v-date-picker v-model="date" @change="menu1 = false"></v-date-picker>
                                </v-menu>
                            </div>
                        <v-select label="Type" outlined :items="types" v-model="type"></v-select>
                        </v-col>
                        <v-col cols="12" md="6">
                                <v-time-picker v-model="time" format="ampm" :landscape="$vuetify.breakpoint.smAndUp" ampm-in-title width="200px"></v-time-picker>
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
            timerDetails: String,
            timer_type: Number
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
                date: '',
                menu1: false,
                time: '',
                menu2: false,
                details: '',
                picker: '',
                errors: [],
                color: ''
            }
        },
        methods: {
            openModal(){
                this.getNow()
                if(this.ticket == ''){
                    alert('You must select a ticket first.')
                } else {
                    this.dialog = true
                    this.time = moment(new Date()).format("HH:mm")
                    this.date = new Date().toISOString().substr(0, 10)
                }
                this.type = this.timer_type
            },
            close() {
                this.dialog = false
                this.date = new Date().toISOString().substr(0, 10)
                this.details = ''
                this.errors = []
            },
            insertTimer() {
                console.log(this.ticket)
                this.apiCall("insert-timer", {ticket_id: this.ticket, user_id: this.$session.get('user_id'), start_date: this.date + " " + this.time + ":00", details: this.details, type: this.type, client_id: this.client_id}).then((response) => {
                    if(response.success) {
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
            },
            getNow(){
                this.apiCall("get-server-time", null).then((res) => {
                    if(res.success){
                        this.time = moment(res.now).format("HH:mm")
                    }
                }).catch((error)=>{
                    console.log(error)
                })
            }
        },
        computed: {
            computedDateFormattedMomentjs() {
                return this.date ? moment(this.date).format('YYYY-MM-DD') : ''
            },
        }
    }
</script>

<style scoped>

</style>