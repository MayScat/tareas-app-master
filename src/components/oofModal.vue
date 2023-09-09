<template>
<div>
    <v-list-item @click="openModal">
        <v-list-item-title>
            <v-icon>mdi-clock</v-icon> Ouf of Office
        </v-list-item-title>
    </v-list-item>
    <v-dialog persistent scrollable v-model="dialog" max-width="850px">
        <v-card>
            <v-list dark>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title class="headline">Out of Office Hours</v-list-item-title>
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
                        <v-col cols="3">
                            <div @click="menu1=true">
                                <v-menu v-model="menu1" :close-on-content-click="false" max-width="290">
                                <template v-slot:activator="{ on }">
                                    <v-text-field outlined
                                        append-icon="mdi-calendar"
                                        hide-details
                                        :value="computedDateFormattedMomentjs" label="From" readonly
                                        v-on="on" v-on:click:append="menu1=true"></v-text-field>
                                    </template>
                                    <v-date-picker v-model="date" @change="menu1 = false"></v-date-picker>
                                </v-menu>
                            </div>
                        </v-col>
                        <v-col cols="3">
                            <div @click="menu3=true">
                                <v-menu v-model="menu3" :close-on-content-click="false" max-width="290">
                                    <template v-slot:activator="{ on }">
                                        <v-text-field outlined
                                            append-icon="mdi-calendar"
                                            hide-details
                                            :value="computedDateFormattedMomentjs2" label="To" readonly
                                            v-on="on" v-on:click:append="menu3=true"></v-text-field>
                                    </template>
                                    <v-date-picker v-model="date2" @change="menu3 = false"></v-date-picker>
                                </v-menu>
                            </div>
                        </v-col>
                        <v-col cols="2">
                            <v-btn x-large block color="primary darken-2" @click="filter">Filter</v-btn>
                        </v-col>
                        <v-col cols="4" class="text-end">
                            <oof-modal-add :user_id="user_id"></oof-modal-add>
                        </v-col>
                        <v-col cols="12">
                            <v-data-table :headers="headers" style="cursor: pointer; border: 1px solid lightgrey;" :items="hours">
                                <template v-slot:item.delete="{ item }">
                                    <v-icon big :disabled="!item.editable" color="error darken-2" @click="deleteHour(item.id)">mdi-delete</v-icon>
                                </template>
                                <template v-slot:item.edit="{ item }">
                                    <oof-modal :editable="item.editable" :out_id="item.id"></oof-modal>
                                </template>
                            </v-data-table>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn color="error darken-2" @click="close">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</div>
</template>

<script>
    import moment from 'moment'
    import OofModal from '@/components/OutOfOfficeModal.vue'
    import OofModalAdd from '@/components/OutOfOfficeAdd.vue'
    export default {
        components: {
            OofModal,
            OofModalAdd
        },
        props: {
            user_id: Number,
        },
        data() {
            return {
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
                hours: [],
                errors: [],
                headers: [
                    {
                       text: "Date",
                       align: "left",
                       value: "start_date", 
                    },
                    {
                       text: "Edit",
                       align: "center",
                       value: "edit", 
                    },
                    {
                       text: "Period",
                       align: "left",
                       value: "period", 
                    },
                    {
                       text: "Reason",
                       align: "left",
                       value: "reason"
                    },
                    {
                       text: "Delete",
                       align: "center",
                       value: "delete"
                    }
                ],
                color: ''
            }
        },
        mounted(){
            Events.$on("reload-mod-table", () => {
                this.getHours();
            })
        },
        methods: {
            openModal(){
                setTimeout(() => {
                    this.dialog = true
                }, 250);
                this.date = moment(new Date()).add(-15,'days').format('YYYY-MM-DD')
                this.date2 = moment(new Date()).add(15,'days').format('YYYY-MM-DD')
                this.getHours()
            },
            edit(id){
                console.log(id)
            },
            deleteHour(id){
                confirm('Are you sure you want to delete this out of office hour?') &&
                this.apiCall('delete-oof-hours',{id: id}).then((res) => {
                    if (res.success) {
                        Events.$emit('reload-mod-table');
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            getHours(){
                this.apiCall('get-oof-hours',{user_id: this.user_id, from_date: this.date, to_date: this.date2}).then((res) => {
                if (res.success) {
                    this.hours = res.hours
                }
                }).catch((error) => {
                    console.log(error)
                })
            },
            filter(){
                this.apiCall('get-oof-hours',{user_id: this.user_id, from_date: this.date, to_date: this.date2}).then((res) => {
                if (res.success) {
                    this.hours = res.hours
                }
                }).catch((error) => {
                    console.log(error)
                })
            },
            close() {
                this.dialog = false
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