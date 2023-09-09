<template>
    <v-container fluid>
        <v-card>
            <v-app-bar dense dark class="elevation-2">
                <v-toolbar-title class="d-none d-sm-flex d-sm-none d-md-flex mr-5">
                    <v-icon class="mx-2">mdi-account</v-icon>Holidays: {{holidays.length}}
                </v-toolbar-title>
                <create-modal></create-modal>
                <v-spacer></v-spacer>
                <v-spacer></v-spacer>
                <v-text-field class="d-none d-sm-flex d-sm-none d-md-flex" v-model="search" append-icon="mdi-magnify"
                    label="Search" single-line hide-details>
                </v-text-field>
            </v-app-bar>
            <v-text-field class="px-4 d-md-none d-sm-flex" v-model="search" append-icon="mdi-magnify" label="Search"
                single-line hide-details></v-text-field>
            <v-data-table :headers="headers" :items="holidays" :search="search">
                <template v-slot:item.action="{ item }">
                    <edit-modal :holiday="item.id"></edit-modal>
                </template>
                <template v-slot:item.delete="{ item }">
                    <v-icon big color="error darken-2" @click="deleteClient(item.id)">mdi-delete</v-icon>
                </template>
            </v-data-table>
        </v-card>
    </v-container>
</template>

<script>
    import EditModal from '@/components/EditHolidayModal.vue'
    import CreateModal from '@/components/CreateHolidayModal.vue'
    export default {
        components: {
            EditModal,
            CreateModal
        },
        data() {
            return {
                headers: [{
                    text: "Date",
                    value: "date"
                }, 
                {
                    text: "Holiday Name",
                    value: "holiday_name"
                },
                {
                    text: "Edit",
                    sortable: false,
                    value: "action"
                },
                {
                    text: "Delete",
                    sortable: false,
                    value: "delete"
                }],
                holidays: [],
                search: ''
            }
        },
        filters: {

        },
        mounted() {
            Events.$on("reload", () => {
                this.apiCall('get-holidays-config', null).then((res) => {
                    if (res.success) {
                        this.holidays = res.holidays
                    }
                }).catch((error) => {
                    console.log(error)
                })
            })
            this.apiCall('get-holidays-config').then((res) => {
                if (res.success) {
                    this.holidays = res.holidays
                }
            }).catch((error) => {
                console.log(error)
            })
        },
        methods: {
            deleteClient(id) {
                confirm("Are you sure you want to delete this holiday?") &&
                this.apiCall("delete-holiday", {id: id}).then((res) => {
                    if (res.success){
                        Events.$emit("reload");
                    }
                })
            }
        },
    }
</script>

<style scoped>

</style>