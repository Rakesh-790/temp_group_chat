export const ACCESS_COOKIE_OPTIONS = {

    httpOnly:true,

    secure:process.env.NODE_ENV==="production",

    sameSite:'strict' as const,

    maxAge:15*60*1000

};

export const REFRESH_COOKIE_OPTIONS={

    httpOnly:true,

    secure:process.env.NODE_ENV==="production",

    sameSite:'strict' as const,

    maxAge:30*24*60*60*1000

};