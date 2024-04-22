// Assuming the use of classes from 'class-transformer' for date handling or plain TypeScript

export interface Challenge {
    title: string
    saved: number // BigDecimal in Java, but TypeScript uses number for floating points
    target: number
    description: string
    createdOn: Date // Mapping ZonedDateTime to Date
    dueDate?: Date // Mapping ZonedDateTime to Date, optional since Temporal annotation not always implies required
    type?: string // Not specified as @NotNull, so it's optional
    completion?: number // Assuming BigDecimal maps to number, optional due to @Transient
    completedOn?: Date // Adding the new variable as optional
}
