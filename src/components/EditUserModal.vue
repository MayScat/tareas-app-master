<template>
<div class="d-inline-block">
    <v-icon color="success darken-2" @click="getUser">mdi-pencil</v-icon>
    <v-dialog persistent v-model="dialog" scrollable max-width="700px">
        <v-card>
            <v-app-bar dark>
                <v-toolbar-title>
                    Edit User:
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-icon @click="close">mdi-close</v-icon>
            </v-app-bar>
            <v-card-text>
                <br>
                <div v-if="errors != []">
                    <v-alert :type="color" v-for="error in errors" :key="error.index">
                        {{error}}
                    </v-alert>
                </div>
                <v-row>
                    <v-col class="text-center" cols="6" sm="6">
                        <v-avatar size="125" :color="bColor">
                            <span class='text-center' :style="{ color: fColor, fontSize: '50px' }"><b>{{firstName.charAt(0)}}{{lastName.charAt(0)}}</b></span>
                        </v-avatar><br><br>
                        [ <a @click="toggleEdit()">{{showEdit ? 'Hide Edit Colors' : 'Show Edit Colors'}}</a> ]
                    </v-col>
                    <v-col cols="6" sm="6">
                        <v-text-field label="First Name" outlined v-model="firstName"></v-text-field>
                        <v-text-field label="Last Name" hide-details outlined v-model="lastName"></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="6" v-show="showEdit">
                        <v-label>
                            Background Color
                        </v-label>
                        <v-color-picker 
                            class="no-alpha" flat
                            dot-size="25"
                            hide-mode-switch
                            hide-sliders
                            mode="hexa"
                            swatches-max-height="90"
                            v-model="bColor"
                        >
                        </v-color-picker>
                    </v-col>
                    <v-col cols="6" sm="6" v-show="showEdit">
                        <v-label>Font Color</v-label>
                        <v-color-picker
                            class="no-alpha" flat
                            dot-size="25"
                            hide-mode-switch
                            hide-sliders
                            mode="hexa"
                            swatches-max-height="90"
                            v-model="fColor"
                        >
                        </v-color-picker>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-text-field label="Email" hide-details outlined v-model="email"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-select :items="statuses" hide-details label="Status" outlined v-model="selectedActive"></v-select>
                    </v-col>
                    <v-col col="12" sm="12">
                        <h4>Permissions:</h4>
                        <v-treeview height="200px" selectable :items="tree" v-model="realPerms">
                        </v-treeview>
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
            user: Object,
        },
        data() {
            return {
                firstName: '',
                lastName: '',
                email: '',
                fColor: '#000000FF',
                bColor: '#C0C0C0FF',
                password: '',
                showEdit: false,
                perms: [],
                selectedType: '',
                selectedActive: '',
                errors: [],
                color: '',
                tree: [],
                realPerms: [],
                id: '',
                dialog: false,
                statuses: [{
                    text: "Active",
                    value: 1
                }, {
                    text: "Inactive",
                    value: 2
                }],
                types: [{
                    text: "Admin",
                    value: 1
                }, {
                    text: "User",
                    value: 2
                }, {
                    text: "Client",
                    value: 3
                }]
            }
        },
        methods: {
            toggleEdit(){
                this.showEdit = !this.showEdit
            },
            getUser(){
                this.getPerms();
                this.dialog = true
                this.id = this.user.id
                this.firstName = this.user.first_name
                this.lastName = this.user.last_name
                this.email = this.user.email
                this.selectedType = this.user.user_type
                this.selectedActive = this.user.active
                this.companyName = this.user.company_name
                this.address = this.user.address
                this.phone = this.user.phone
                this.bColor = this.user.bColor
                this.fColor = this.user.fColor
                this.perms = this.user.permissions.split(",");
                setTimeout(() => {
                    for(let i = 0; i < this.perms.length; i++) { 
                       this.realPerms.push(this.perms[i] * 1);
                    }
                }, 100);
            },
            getPerms() {
                this.apiCall("get-perms").then((res) => {
                    this.tree = res.permissions
                })
            },
            editUser(){
                this.apiCall("edit-user", {
                    first_name: this.firstName,
                    last_name: this.lastName,
                    id: this.id,
                    email: this.email,
                    active: this.selectedActive,
                    user_type: this.selectedType,
                    companyName: this.companyName,
                    address: this.address,
                    phone: this.phone,
                    bColor: this.bColor,
                    fColor: this.fColor,
                    perms: this.realPerms.join(','),
                }).then((res) => {
                    if(res.success){
                        this.errors = ['User successfully edited.']
                        this.color = "success"
                        setTimeout(() => {
                            Events.$emit("reload-table")
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
                this.firstName = ''
                this.companyName = ''
                this.lastName = ''
                this.email = ''
                this.password = ''
                this.selectedActive = ''
                this.selectedType = ''
                this.id = ''
                this.address = ''
                this.phone = ''
            }
        }
    }
</script>

<style scoped>

</style>