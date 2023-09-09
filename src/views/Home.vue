<template>
  <div>
    <v-container fluid>
      <v-row class="">
        <v-col cols="12" md="3">
          <v-card class="elevation-1">
            <v-toolbar dense class="elevation-0" dark>
              <v-icon class="mr-2">mdi-view-dashboard</v-icon>
              <v-toolbar-title>
                Clients
              </v-toolbar-title>
              <v-spacer></v-spacer>
<!--               <project-modal :clients="clients"></project-modal> -->
            </v-toolbar>
            <v-card-text>
              <v-subheader class="font-weight-bold">
                <v-text-field append-icon="mdi-magnify" label="Search" v-model="search"></v-text-field>
              </v-subheader>
              <v-data-table :headers="headers" :items="clients" :search="search.trim()" @click:row="getProjects" style="cursor: pointer;">
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="9">
          <v-card class="elevation-1">
            <v-toolbar dense class="elevation-0" dark>
              <v-icon class="mr-2">mdi-view-dashboard</v-icon>
              <v-toolbar-title>
                Client Information: <span style="color: orange;">{{client_name}}</span>
              </v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <v-subheader class="font-weight-bold">
              </v-subheader>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
  import ProjectModal from '@/components/Modal.vue'
  import SubProjectModal from '@/components/SubProjectModal.vue'
  export default {
    components: {
      ProjectModal,
      SubProjectModal
    },
    data() {
      return {
        projects: [],
        subProjects: [],
        clients: [],
        projs: [],
        search: '',
        search2: '',
        client_name: '',
        headers: [{
            text: "Client",
            value: "client_name",
            width: "40%"
          },
        ]
      }
    },
    filters: {

    },
    beforeMount() {

    },
    mounted() {
      this.getClients()
    },
    methods: {
      getClients(){
        this.apiCall('get-clients').then((res) => {
          if(res.success){
            this.clients = res.clients
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      getProjects(data){
        this.client_name = data.client_name
      }
    }
  };
</script>
<style scoped>
tbody tr:nth-of-type(odd) {
   background-color: rgba(0, 0, 0, .05);
 }
</style>