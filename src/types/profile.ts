export interface Profile {
    id: number
    firstName: string
    lastName: string
    email: string
    username: string
    password?: string
    savedAmount?: number
    spendingAccount: {
        accNumber?: number
        accountType?: string
        balance?: number
    }
    savingAccount: {
        accNumber?: number
        accountType?: string
        balance?: number
    }
    savedAmount?: number
    badges?: object[]
    hasPasskey?: boolean
}
