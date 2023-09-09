<template>
    <v-dialog persistent scrollable v-model="dialog" max-width="700px">
        <template v-slot:activator="{ on }">
            <v-btn color="warning" v-on="on">
                <v-icon>mdi-plus</v-icon>New user
            </v-btn>
        </template>
        <v-card>
            <v-app-bar dark>
                <v-toolbar-title>
                    New User
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
                    <v-col cols="12" sm="6">
                        <v-text-field label="Password" type="password" hide-details outlined v-model="password"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-select :items="statuses" hide-details label="Status" outlined v-model="active"></v-select>
                    </v-col>
                    <v-col col="12" sm="12">
                        <h4>Permissions:</h4>
                        <v-treeview height="200px" independent selectable :items="tree" v-model="realPerms">
                        </v-treeview>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" @click="close">Close</v-btn>
                <v-btn color="success" @click="createUser">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
    export default {
        data() {
            return {
                firstName: '',
                lastName: '',
                email: '',
                companyName: '',
                password: '',
                showEdit: false,
                type: '',
                fColor: '#000000FF',
                bColor: '#C0C0C0FF',
                active: 1,
                dialog: false,
                errors: [],
                phone: '',
                address: '',
                tree: [],
                realPerms: [],
                color: '',
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
        mounted(){
            this.getPerms();
        },
        watch: {
            dialog(){
                if(this.dialog == true){
                    this.getRandomColor();
                }
            }
        },
        methods: {
            toggleEdit(){
                this.showEdit = !this.showEdit
            },
            getPerms() {
                this.apiCall("get-perms").then((res) => {
                    this.tree = res.permissions
                })
            },
            getRandomColor() {
                this.apiCall("get-random-color").then((res) => {
                    if(res.success){
                        this.bColor = res.bgcolor
                        this.fColor = res.fontcolor
                    }
                })
            },
            createUser() {
                this.apiCall("register", {
                    first_name: this.firstName,
                    last_name: this.lastName,
                    password: this.password,
                    email: this.email,
                    active: this.active,
                    user_type: this.type,
                    companyName: this.companyName,
                    phone: this.phone,
                    address: this.address,
                    bColor: this.bColor,
                    fColor: this.fColor,
                    perms: this.realPerms.join(",")
                }).then((res) => {
                    if(res.success){
                        this.errors = ['User successfully added']
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
                this.lastName = ''
                this.email = ''
                this.password = ''
                this.type = ''
                this.active = 1
                this.bColor = '#C0C0C0FF'
                this.fColor = '#000000FF'
                this.realPerms = []
                this.companyName = ''
            }
        }
    }
</script>

<style scoped>

</style>