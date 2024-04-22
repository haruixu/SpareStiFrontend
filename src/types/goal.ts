export interface Goal {
    /** The unique identifier for the Goal, must not be null. */
    id: number

    /**
     * The title of the Goal, must not be null, empty, or only whitespace.
     */
    title: string

    /**
     * The amount saved towards the Goal so far. Must not be null and must be zero or positive.
     */
    saved: number

    /**
     * The target amount to achieve for the Goal. Must not be null and must be positive.
     */
    target: number

    /**
     * Completion percentage of the Goal. Must not be null and must be zero or positive.
     */
    completion: number

    /**
     * A description of the Goal, must not be null, empty, or only whitespace.
     */
    description: string

    /**
     * The priority of the Goal, must not be null and must be zero or positive.
     */
    priority: number

    /**
     * The date and time when the Goal was created. Must be a date in the past.
     */
    createdOn: Date

    /**
     * The date and time by which the Goal is due. Must be a date in the future.
     */
    due: Date
}
