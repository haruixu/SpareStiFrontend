// Assuming the use of classes from 'class-transformer' for date handling or plain TypeScript

export interface Challenge {
    id?: number
    title: string
    perPurchase: number
    saved: number // BigDecimal in Java, but TypeScript uses number for floating points
    target: number
    description: string
    due: string // Mapping ZonedDateTime to Date, optional since Temporal annotation not always implies required
    createdOn?: string // Mapping ZonedDateTime to Date
    type?: string // Not specified as @NotNull, so it's optional
    completion?: number // Assuming BigDecimal maps to number, optional due to @Transient
    completedOn?: string | null // Adding the new variable as optional
}
