<template>
<div>
  <v-btn @click="openModal()" color="warning">
    Add (+)
  </v-btn>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
        <v-app-bar dense dark>
            <v-toolbar-title>New Document</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-icon @click="close">mdi-close</v-icon>
        </v-app-bar>
        <v-card-text>
            <div v-if="errors != []">
                <v-alert :type="color" v-for="error in errors" :key="error.index">
                    {{error}}
                </v-alert>
            </div>
            <v-container>
                <v-row dense>
                    <v-col cols="12">
                        <v-text-field label="Document Name" type="text" v-model="doc_name" outlined hide-details></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <input type="file" id="file" ref="file" @change="handleFileUpload()"/>
                    </v-col>
                    <v-col cols="12">
                        <v-checkbox v-model="global" label="Assign to Project (Default: Assigned to Task)"></v-checkbox>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn color="error darken-2" @click="close()">Close</v-btn>
            <v-btn color="success darken-2" @click="save()">Save</v-btn>
        </v-card-actions>
    </v-card>
  </v-dialog>
</div>
</template>

<script>
import axios from 'axios'
import qs from 'qs'
export default {
    props: {
        task_id: Number
    },
    data() {
        return {
            doc_name: '',
            dialog: false,
            file: '',
            global: false,
            errors: [],
            color: ''
        }
    },
    methods: {
        openModal(){
            this.dialog = true;
        },
        handleFileUpload(){
            this.file = this.$refs.file.files[0];
        },
        save(){
            if(this.file == ''){
                this.errors = ['File is required.']
                this.color = 'error'
            } else {
                let formData = new FormData();
                    formData.append('task_id',this.task_id)
                    formData.append('file', this.file)
                    formData.append('doc_name', this.doc_name)
                    formData.append('global', this.global)
                    formData.append('user_id', this.$session.get('user_id'))
                    axios.post('https://pass2.design2net.com/api/add-document.html',formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                        }).then((response) => {
                        console.log(response)
                        if (response.data.success) {
                            this.errors = ['Succesfully added document.']
                            this.color = 'success'
                            setTimeout(() => {
                                Events.$emit('reload');
                                this.close()
                            }, 1500)
                            
                        } else {
                            this.errors = response.data.errors
                            this.color = 'error'
                        }
                    }, (error) => {
                        console.log(error)
                    })
            }
        },
        close(){
            this.dialog = false;
            this.errors = []
            this.color = ''
            this.doc_name = ''
            this.file = ''
        }
    }
}
</script>

<style>

</style>