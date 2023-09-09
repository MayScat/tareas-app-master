<template>
    <transition name="fade">
        <v-container class="fill-height" fluid>
            <v-row align="center" justify="center">
                <v-col cols="12" sm="8" md="4">
                    <v-card class="elevation-12" @keyup.enter="submit">
                        <v-toolbar color="primary" dark flat>
                            <v-toolbar-title class="font-weight-bold">PASS 2.0</v-toolbar-title>
                            <div class="flex-grow-1"></div>
                        </v-toolbar>
                        <v-card-text>
                            <v-text-field label="Email" name="username" prepend-icon="mdi-account" v-model="email"
                                type="text"></v-text-field>
                            <v-text-field id="password" label="Password" name="password" v-model="password"
                                prepend-icon="mdi-lock" type="password"></v-text-field>
                            <div v-if="errors != []">
                                <v-alert type="error" v-for="error in errors" :key="error.index">
                                    {{error}}
                                </v-alert>
                            </div>
                        </v-card-text>
                        <v-card-actions>
                            <div class="flex-grow-1"></div>
                            <v-btn color="primary" @click="login">Log-in</v-btn>
                        </v-card-actions>
                        <v-dialog v-model="dialog" width="600px">
                            <v-card>
                                <v-app-bar dark dense>
                                    <v-toolbar-title>
                                        Reset Password
                                    </v-toolbar-title>
                                </v-app-bar>
                                <v-card-text>
                                    <br>
                                    <div v-if="errors != []">
                                        <v-alert :type="color" v-for="error in errors2" :key="error.index">
                                            {{error}}
                                        </v-alert>
                                    </div>
                                    <v-text-field type="password" v-model="newPassword" label="New Password"></v-text-field>
                                    <v-text-field type="password" v-model="confirmPassword" label="Confirm New Password"></v-text-field>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="error darken-2" @click="closeModal()">Close</v-btn>
                                    <v-btn color="success darken-2" @click="reset()">Reset</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-card>
                </v-col>
            </v-row>
            <v-footer dark app padless>
                <v-col
                  class="text-center"
                  cols="12"
                >
                  {{ new Date().getFullYear() }} — <strong>Design2net &#169;</strong>
                </v-col>
            </v-footer>
        </v-container>
    </transition>
</template>

<script>
import { setTimeout } from 'timers'
    export default {
        data() {
            return {
                email: '',
                password: '',
                errors: [],
                errors2: [],
                dialog: false,
                newPassword: '',
                confirmPassword: '',
                color: ''
            }
        },
        beforeCreate() {
            if (this.$session.exists()) {
                this.$router.push('dashboard')
            }
        },
        mounted(){

        },
        methods: {
            submit(){
                this.apiCall("login", {
                    email: this.email,
                    password: this.password
                }).then((response) => {
                    if (response.success == true) {
                        this.$session.start()
                        this.$session.set("auth_token", response.auth_token)
                        this.$session.set("user_id", response.user_id)
                        this.$session.set("userInfo", response.userInfo)
                        this.$session.set("fColor", response.fColor)
                        this.$session.set("bColor", response.bColor)
                        this.$session.set("code", response.code)
                        this.$session.set("alert", true)
                        if (response.reset_password == 1) {
                            this.openModal()
                        } else {
                            this.$router.push('dashboard')
                        }
                    } else {
                        this.errors = response.errors
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            login() {
                this.apiCall("login", {
                    email: this.email,
                    password: this.password
                }).then((response) => {
                    if (response.success == true) {
                        this.$session.start()
                        this.$session.set("auth_token", response.auth_token)
                        this.$session.set("user_id", response.user_id)
                        this.$session.set("userInfo", response.userInfo)
                        this.$session.set("fColor", response.fColor)
                        this.$session.set("bColor", response.bColor)
                        this.$session.set("code", response.code)
                        if (response.reset_password == 1) {
                            this.openModal()
                        } else {
                            this.$router.push('dashboard')
                        }
                    } else {
                        this.errors = response.errors
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            openModal() {
                this.dialog = true
            },
            reset() {
                if (this.newPassword == this.confirmPassword) {
                    this.apiCall('reset-password', {
                        user_id: this.$session.get('user_id'),
                        newPassword: this.newPassword
                    }).then((res) => {
                        if (res.success) {
                            this.errors = ['Succesfully edited password.']
                            this.color = 'success'
                            setTimeout(() =>{
                                this.$router.push('dashboard')
                            }, 1500)
                        } else {
                            this.color = 'error'
                            this.errors2 = res.errors
                        }
                    }).catch((error) => {
                        console.log(error)
                    })
                } else {
                    this.color = "error"
                    this.errors2 = ['Passwords do not match.']
                }
            },
            closeModal() {
                this.$session.destroy()
                this.dialog = false
                this.newPassword = ''
                this.confirmPassword = ''
                this.errors2 = [],
                this.color = ''
            }
        }
    }
</script>

<style scoped>

</style>