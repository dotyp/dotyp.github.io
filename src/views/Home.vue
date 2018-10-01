<template lang="pug">
div.home(
  @keypress.enter="enterDefault",
  @keypress.up="cursor --", 
  @keypress.down="cursor ++")
  input(type="text", v-model="searchText")
  table
    template(v-for="(s, idx) in currentList()")
      a(:href="siteUrl(s)", target="_blank")
        tr(
          :class="{'selected': idx == cursor}"
        )
          td {{s.name}}
          td {{s.description}}
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import {SiteInfo} from '../site.d.ts'
@Component({
  components: {
    HelloWorld,
  },
  watch: {
    searchText(val){
      this.cursor = 0
      this.$store.dispatch('selectSites', val)
    },
    cursor(val){
      if(val < 0){
        this.cursor = 0
      }else if(val >= this.currentList().length){
        this.cursor = this.currentList().length-1
      }
    }
  }
})
export default class Home extends Vue {
  org = 'dotyp'
  searchText: string = ""
  cursor = 0
  created(){
    this.$store.dispatch('loadSites', this.org)
  }

  enterDefault(){
    if(this.currentList().length-1 >= this.cursor || this.cursor < 0){
      let site = this.currentList()[this.cursor]
      this.enter(site)
    }
  }
  enter(site: SiteInfo){
    let url = this.siteUrl(site)
    let win = window.open(url, '_blank')
    if(win) win.focus()
  }
  siteUrl(site: SiteInfo){
    let [org, repo] = site.full_name.split("/")
    let url = `https://${org}.github.io/${repo}`
    return url
  }
  currentList(){
    return (this.searchText ? 
      this.$store.state.selectedSites : 
      this.$store.state.sites)
  }
}
</script>

<style lang="scss">
.selected{
  background-color: pink;
}
</style>