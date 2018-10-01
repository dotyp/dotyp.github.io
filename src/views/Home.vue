<template lang="pug">
div.home
  input(type="text", v-model="searchText", @keypress.enter="enter")
  table
    tr(v-for="s in (searchText ? $store.state.selectedSites : $store.state.sites)")
      td {{s.name}}
      td {{s.description}}
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

@Component({
  components: {
    HelloWorld,
  },
  watch: {
    searchText(val){
      this.$store.dispatch('selectSites', val)
    }
  }
})
export default class Home extends Vue {
  org = 'dotyp'
  searchText: string = ""
  created(){
    this.$store.dispatch('loadSites', this.org)
  }
  enter(){
    if(this.$store.state.selectedSites.length == 1){
      let [org, repo] = this.$store.state.selectedSites[0].full_name.split("/")
      let url = `https://${org}.github.io/${repo}`
      window.open(url, '_blank').focus()
    }
  }
}
</script>
