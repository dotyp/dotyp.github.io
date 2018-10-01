import Vue from 'vue';
import Vuex from 'vuex';

import axios from 'axios'
import {SiteInfo, SiteQuery, SelectedSite} from './site'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    sites: [] as SiteInfo[],
    selectedSites: [] as SelectedSite[]
  },
  mutations: {
    setSites(state, sites: Array<SiteInfo>){
      state.sites = sites
    },
    selectSites(state, {domain, keywrods}: SiteQuery){
      state.selectedSites = state.sites.map(({name, full_name, description}): SelectedSite => {
        let matchedDomain = null
        let weight = -1
        let highlighted = keywrods && keywrods.filter(k => description.includes(k))
        if(domain && name.match(new RegExp(`^${domain}`))){
          weight = 0
          matchedDomain = domain
        }else if(domain && name.match(new RegExp(`${domain}`))){
          weight = 3
          matchedDomain = domain
        }else if(highlighted && highlighted.length){
          weight = 1
        }
        
        return {
          name,
          full_name,
          description,
          highlighted,
          matchedDomain,
          weight
        }
      }).filter(q => q.weight >= 0)
      .sort((a: SelectedSite, b: SelectedSite) => {
        if(!a){
          return 1
        }else if(!b){
          return -1
        }else if(a.weight != b.weight){
          return a.weight - b.weight
        }else if(a.matchedDomain && b.matchedDomain){
          return a.matchedDomain.length - b.matchedDomain.length
        }else if(a.highlighted && b.highlighted){
          return a.highlighted.length - b.highlighted.length
        }else{
          return 0
        }
      })
    }
  },
  actions: {
    loadSites({commit}, org){
      const url = `https://api.github.com/orgs/${org}/repos`
      axios(url)
      .then(res => res.data)
      .then((sites: SiteInfo[]) => {
        commit('setSites', sites.map(({name, full_name, description})=>{
          return {name, full_name, description}
        }).filter(({name}) => !!name.match(/\.(yp|yi)$/)))
      })
    },
    selectSites({commit}, searchText){
      let query: SiteQuery = 
        /^[.-\w]+$/.test(searchText) ?
          {
            domain: searchText, 
            keywrods: null
          }: {
            domain: null, 
            keywrods: searchText.split(/\s+/)
          }
        commit('selectSites', query)
    }
  },
});
