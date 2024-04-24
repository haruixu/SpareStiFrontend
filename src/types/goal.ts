export interface Goal {
    id: number | null | undefined
    title: string
    saved: number
    target: number
    completion: number
    description: string
    priority: number
    createdOn: string | null | undefined
    due: string
    completedOn: string | null | undefined
}
