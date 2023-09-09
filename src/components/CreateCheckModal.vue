<template>
<div class="d-inline-block">
    <v-btn color="warning" @click="getTodo">Add (+)</v-btn>
    <v-dialog persistent v-model="dialog" scrollable max-width="700px">
        <v-card>
            <v-app-bar dark>
                <v-toolbar-title>
                    Add New To-Do Item:
                </v-toolbar-title>
                <v-spacer></v-spacer>
            </v-app-bar>
            <v-card-text>
                <br>
                <div v-if="errors != []">
                    <v-alert :type="color" v-for="error in errors" :key="error.index">
                        {{error}}
                    </v-alert>
                </div>
                <v-row dense>
                    <v-col cols="4">
                        <v-menu
                            v-model="menu2"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                        >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="date"
                                label="ETA (Optional)"
                                readonly
                                outlined
                                append-icon="mdi-calendar"
                                hide-details
                                v-bind="attrs"
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="date"
                              @input="menu2 = false"
                            ></v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col cols="8" class='d-flex justify-end'>
                        <v-checkbox v-model="prio" hide-details label="High Priority"></v-checkbox>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field v-model="description_short" label="Description Short" hide-details outlined></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-textarea v-model="details" hide-details label="Optional comments or notes" outlined></v-textarea>
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
            task_id: Number
        },
        data() {
            return {
                errors: [],
                color: '',
                dialog: false,
                id: '',
                date: '',
                menu2: false,
                details: '',
                prio: 0,
                description_short: ''
            }
        },
        methods: {
            getTodo(){
                this.dialog = true
                this.id = this.todo_id
            },
            editUser(){
                this.apiCall("create-checklist", {
                    description_short: this.description_short,
                    comments: this.details,
                    prio: this.prio,
                    eta: this.date,
                    task_id: this.task_id
                }).then((res) => {
                    if(res.success){
                        this.errors = ['To-do item successfully created.']
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
                this.date= ''
                this.menu2= false
                this.details= ''
                this.prio= 0
                this.description_short= ''
            }
        }
    }
</script>

<style scoped>

</style>