import axiosClient from "../api/axiosClient"

export type Review = {
    comment: string
    rating: number
    reviewer: string
}

export type Psychologist = {
about: string
avatar_url: string
experience: string
initial_consultation: string
license: string
name: string
price_per_hour: number
rating: number
reviews: Review[]
specialization: string
}

export const fetchPsychologists = async (): Promise<Psychologist[]> => {
    const res = await axiosClient.get('/.json')

    const data = res.data

    if(!data) return []

    if(Array.isArray(data)) {
        return data as Psychologist[]
    }

    return Object.values(data) as Psychologist[]
}