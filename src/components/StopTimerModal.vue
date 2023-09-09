<template>
    <div>
        <v-btn block color="error darken-2" :disabled="isDisabled" @click.stop="openModal">
            Stop
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
                                <div @click="menu1=true">
                                    <v-menu v-model="menu1" :close-on-content-click="false" max-width="290">
                                        <template v-slot:activator="{ on }">
                                            <v-text-field outlined
                                                :value="computedDateFormattedMomentjs" clearable label="Stop Date" readonly
                                                v-on="on"></v-text-field>
                                        </template>
                                        <v-date-picker v-model="date" @change="menu1 = false"></v-date-picker>
                                    </v-menu>
                                </div>
                            <v-select :items="types" outlined class="ma-0 pa-0" v-model="type"></v-select>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-time-picker v-if="custom_timer" v-model="time" format="ampm" :landscape="$vuetify.breakpoint.smAndUp" ampm-in-title width="200px"></v-time-picker>
                                <label v-else>(Current Time) - <a style="color: blue; text-decoration: underline;">Custom time</a></label>
                            </v-col>
                            <v-col cols="12">
                                <v-textarea label="Details" outlined v-model="details"></v-textarea>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <div class="flex-grow-1"></div>
                    <v-btn color="error darken-2" @click="close">Close</v-btn>
                    <v-btn color="success darken-2" @click="stopTimer">Stop</v-btn>
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
            timer_id: Number,
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
                custom_timer: false,
                type: '',
                dialog: false,
                date: new Date().toISOString().substr(0, 10),
                menu1: false,
                menu2: false,
                details: '',
                picker: '',
                time: '',
                errors: [],
                color: ''
            }
        },
        computed:{

        },
        methods: {
            openModal() {
                this.type = this.timer_type
                this.dialog = true
                this.details = this.timerDetails
                this.getNow()
            },
            close() {
                this.dialog = false
                this.date = new Date().toISOString().substr(0, 10)
                this.details = ''
                this.errors = []
            },
            getNow(){
                this.apiCall("get-server-time", null).then((res) => {
                    if(res.success){
                        this.time = moment(res.now).format("HH:mm")
                    }
                }).catch((error)=>{
                    console.log(error)
                })
            },
            stopTimer() {
                if(this.time == ''){
                    this.errors = ['You have to put a time']
                    return false
                }
                this.apiCall("stop-timer", {
                    ticket_id: this.ticket,
                    user_id: this.$session.get('user_id'),
                    timer_id: this.timer_id,
                    details: this.details,
                    client_id: this.client_id,
                    stop_date: this.date + " " + this.time + ":00",
                    type: this.type
                }).then((response) => {
                    if (response.success) {
                        Events.$emit('stopTimer')
                        this.close()
                    } else {
                        this.errors = response.errors
                        this.color = 'error'
                    }
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