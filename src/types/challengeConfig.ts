export interface ChallengeConfig {
    experience: string
    motivation: string
    challengeTypeConfigs: {
        type: string
        generalAmount: number | null
        specificAmount: number | null
    }[]
}
