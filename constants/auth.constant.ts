export type AuthPopupModesType = typeof AUTH_POPUP_MODES[keyof typeof AUTH_POPUP_MODES];
    
export const AUTH_POPUP_MODES = {
    SIGN_IN: 'sign-in',
    CONNECT_GOOGLE: 'connect-google',
} as const