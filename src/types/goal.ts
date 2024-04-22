export interface Goal {
    id: number
    title: string
    saved: number
    target: number
    completion: number
    description: string
    priority: number
    createdOn: string
    dueDate: string | null
}
