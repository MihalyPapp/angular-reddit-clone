export interface LoginResponsePayload {
    authenticationToken: string,
    expiresAt: Date,
    refreshToken: string,
    username: string
}