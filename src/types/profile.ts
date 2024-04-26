export interface Profile {
    id: string
    firstName: string
    lastName: string
    email: string
    username: string
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
    badges?: object[]
}
