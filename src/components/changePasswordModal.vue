<template>
<div>
<v-list-item @click="openModal">
    <v-list-item-title>
        <v-icon>mdi-lock</v-icon> Change Password
    </v-list-item-title>
</v-list-item>
<v-dialog persistent v-model="dialog" width="600px">
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
</div>
</template>

<script>
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
    methods: {
        openModal(){
                setTimeout(() => {
                    this.dialog = true
                }, 250);
        },
        closeModal(){
            this.dialog = false
            this.newPassword = ''
            this.confirmPassword = ''
        },
        reset() {
            if (this.newPassword == this.confirmPassword) {
                this.apiCall('reset-password', {
                    user_id: this.$session.get('user_id'),
                    newPassword: this.newPassword
                }).then((res) => {
                    if (res.success) {
                        this.errors2 = ['Succesfully edited password.']
                        this.color = 'success'
                        setTimeout(() => {
                            window.location.reload()
                        }, 900)
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
    }
}
</script>

<style>

</style>