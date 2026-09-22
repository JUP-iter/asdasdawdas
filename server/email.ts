export async function sendPasswordResetEmail(email:string,token:string){
  const appUrl=process.env.APP_URL||'http://localhost:5173'
  const resetUrl=`${appUrl}/password-reset?token=${encodeURIComponent(token)}`
  if(process.env.EMAIL_PROVIDER==='resend'&&process.env.RESEND_API_KEY&&process.env.EMAIL_FROM){
    const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{authorization:`Bearer ${process.env.RESEND_API_KEY}`,'content-type':'application/json'},body:JSON.stringify({from:process.env.EMAIL_FROM,to:[email],subject:'Reset your MadeByAibek password',html:`<p>Use the secure link below to reset your MadeByAibek password. It expires in one hour.</p><p><a href="${resetUrl}">Reset password</a></p>`})})
    if(!response.ok)throw new Error('Password reset email could not be delivered.')
  }else console.log(`Password reset for ${email}: ${resetUrl}`)
}
