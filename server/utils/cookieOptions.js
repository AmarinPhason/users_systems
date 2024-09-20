export const setCookieOptions = () => ({
  httpOnly: process.env.NODE_ENV === "development" ? false : true,
  secure: process.env.NODE_ENV === "development" ? false : true,
  sameSite: process.env.NODE_ENV === "development" ? "lax" : "none", // เปลี่ยนเป็น 'none' หากใช้ secure ใน production
  expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 day
});
