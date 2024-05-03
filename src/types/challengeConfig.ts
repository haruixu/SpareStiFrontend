// Definition of the ChallengeConfig type
export interface ChallengeConfig {
    experience: string // Mapping to an enum in Java, but TypeScript uses string
    motivation: string // Mapping to an enum in Java, but TypeScript uses string
    challengeTypeConfigs: {
        type: string // Mapping to an enum in Java, but TypeScript uses string
        generalAmount: number | null // BigDecimal in Java, but TypeScript uses number
        specificAmount: number | null // BigDecimal in Java, but TypeScript uses number
    }[]
}
