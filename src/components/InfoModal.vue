<template>

    <v-dialog scrollable v-model="dialog" max-width="700px">
        <template v-slot:activator="{ on }">
            <v-list-item-title>Ticket: <a v-on="on">{{ticket_name}} - {{type | projType}}</a></v-list-item-title>
        </template>
        <v-card>
            <v-card-title>Timer Information: {{ticket_name}}</v-card-title>
            <v-card-text>
                <br>
                <v-text-field v-model="timer.project_name" label="Project Name" disabled outlined></v-text-field>
                <v-text-field label="Ticket Name" v-model="ticket_name" disabled outlined></v-text-field>
                <v-textarea label="Details" :value="timer.details" disabled outlined></v-textarea>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" @click="dialog = false">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        props: {
            ticket_name: String,
            type: Number,
            timer: Object
        },
        data() {
            return {
                dialog: false
            }
        },
        filters: {
            projType(value) {
                if (value == 1) {
                    return "Programming (General)"
                } else if (value == 2) {
                    return "Programming (New Feature)"
                } else if (value == 3) {
                    return "Bugs / Errors"
                } else if (value == 4) {
                    return "Support"
                }
            }
        }
    }
</script>

<style  scoped>
</style>