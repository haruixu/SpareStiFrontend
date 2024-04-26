export interface Goal {
    id?: number
    title: string
    saved: number
    target: number
    completion?: number
    description: string
    priority?: number
    createdOn?: string
    due: string
    completedOn?: string
}
