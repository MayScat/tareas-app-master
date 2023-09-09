<template>
<div>
    <v-btn x-large color="primary" @click="openModal">
        <v-icon >mdi-plus</v-icon> Add
    </v-btn>
    <v-dialog persistent scrollable v-model="dialog" max-width="900px">
        <v-card>
            <v-list dark>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title class="headline">Edit Out of Office:</v-list-item-title>
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
                        <v-col cols="12">
                            <v-row dense>
                                <v-col cols="12">
                                    <v-row dense>
                                        <v-col>
                                            <v-select v-model="selectedType" :items="ranges" label="Range" outlined hide-details></v-select>
                                        </v-col>
                                        <v-col v-if="selectedType == 1 || selectedType == 2 || selectedType == 3 || selectedType == 4">
                                            <div @click="menu1=true">
                                                <v-menu  v-model="menu1" :close-on-content-click="false" max-width="290">
                                                <template v-slot:activator="{ on }">
                                                    <v-text-field outlined
                                                        append-icon="mdi-calendar"
                                                        hide-details
                                                        :value="computedDateFormattedMomentjs" label="From" readonly
                                                        v-on="on" v-on:click:append="menu1=true"></v-text-field>
                                                    </template>
                                                    <v-date-picker  v-model="date" @change="menu1 = false"></v-date-picker>
                                                </v-menu>
                                            </div>
                                        </v-col>
                                        <v-col v-if="selectedType == 2 || selectedType == 4">
                                            <v-text-field type="time"  outlined hide-details v-model="time" label="From Time"></v-text-field>
                                        </v-col>
                                        <v-col v-if="selectedType == 3 || selectedType == 4" v-model="date2">
                                            <div @click="menu3=true">
                                                <v-menu  v-model="menu3" :close-on-content-click="false" max-width="290">
                                                    <template v-slot:activator="{ on }">
                                                        <v-text-field outlined
                                                            append-icon="mdi-calendar"
                                                            hide-details
                                                            :value="computedDateFormattedMomentjs2" label="To" readonly
                                                            v-on="on" v-on:click:append="menu3=true"></v-text-field>
                                                    </template>
                                                    <v-date-picker v-model="date2"  @change="menu3 = false"></v-date-picker>
                                                </v-menu>
                                            </div>
                                        </v-col>
                                        <v-col v-if="selectedType == 2 || selectedType == 4">
                                            <v-text-field type="time"  v-model="time2" outlined hide-details label="To Time"></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col cols="12">
                            <v-row dense>
                                <v-col cols="12">
                                    <v-row dense>
                                        <v-col cols="12">
                                            <v-select outlined hide-details :items="reasons" label="Reason" v-model="selectedReason"></v-select>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col cols="12">
                            <v-textarea outlined hide-details v-model="comments" label="Details & Comments"></v-textarea>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn color="error darken-2" @click="close">Close</v-btn>
                <v-btn color="success darken-2" @click="save">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</div>
</template>

<script>
    import moment from 'moment'
    export default {
        props: {
            user_id: Number
        },
        data() {
            return {
                type: '',
                selectedType: 1,
                dialog: false,
                date: new Date().toISOString().substr(0, 10),
                date2: new Date().toISOString().substr(0, 10),
                menu1: false,
                time: '',
                time2: '',
                menu2: false,
                menu3: false,
                menu4: false,
                comments: '',
                details: '',
                reasons: [
                    {text: "Choose a reason", value:""},
                    {text: "Vacation", value:"Vacation"},
                    {text: "Medical", value:"Medical"},
                    {text: "Other", value:"Other"}
                ],
                ranges: [
                    {text: "Full Day", value: 1},
                    {text: "Specific Hours", value: 2},
                    {text: "Range Full Days", value: 3},
                    {text: "Spec. Hours Days", value: 4}
                ],
                selectedReason: '',
                picker: '',
                hour: {},
                errors: [],
                color: ''
            }
        },
        methods: {
            openModal(){
                this.dialog = true
            },
            save(){
                this.apiCall("create-oof-hours", {user_id: this.user_id, reason: this.selectedReason, comments: this.comments,
                start_time: this.time, end_time: this.time2, start_date: this.date, end_date: this.date2, ranges: this.selectedType}).then((res) => {
                    if (res.success){
                        Events.$emit("reload-mod-table");
                        this.close()
                    } else {
                        this.errors = res.errors
                        this.color = 'error'
                    }
                })
            },
            close() {
                this.dialog = false
                this.date = new Date().toISOString().substr(0, 10)
                this.date2 = new Date().toISOString().substr(0, 10)
                this.time = ''
                this.time2 = ''
                this.selectedReason = ''
                this.selectedType = 1
                this.comments = ''
                this.errors = []
            },
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