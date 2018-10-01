export interface SiteInfo{
    name: string
    full_name: string
    description: string
}

export interface SiteQuery{
    domain: string | null | undefined
    keywrods: string[] | null | undefined
}

export interface SelectedSite extends SiteInfo{
    matchedDomain: string | null | undefined
    highlighted: string[] | null | undefined
    weight: number
}