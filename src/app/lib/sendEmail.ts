import nodemailer from 'nodemailer'
import { render } from '@react-email/render'
import ResetPasswordEmail from '../../email/ResetPasswordEmail'
import VerifyEmail from '../../email/VerifyEmail'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
})

// send mail with defined transport object

// export const sendMail = async (receiverEmail: string, link: string) => {
//   try {
//     return await transporter.sendMail({
//       from: `"JW Centrs help 🚀" <${process.env.GMAIL_EMAIL}>`, // sender address
//       to: receiverEmail, // list of receivers
//       subject: "Замена пароля", // Subject line
//       html: `Намите на эту <a href="${link}">ссылку</a> для сброса пароля. <br/> Сылка годна в течение часа.`, // html body
//     });
//   } catch (err) {
//     console.log(err);
//     throw new Error("Ошибка!");
//   }
// };

export const sendMail = async (receiverEmail: string, name: string, link: string) => {
  const emailHtml = render(ResetPasswordEmail({ userName: name, resetPasswordLink: link }), { pretty: true })

  try {
    return await transporter.sendMail({
      from: `"JW Centrs help 🚀" <${process.env.GMAIL_EMAIL}>`, // sender address
      to: receiverEmail, // list of receivers
      subject: 'Замена пароля', // Subject line
      //html: `Намите на эту <a href="${link}">ссылку</a> для сброса пароля. <br/> Сылка годна в течение часа.`, // html body
      html: emailHtml,
    })
  } catch (err) {
    console.log(err)
    throw new Error('Ошибка!')
  }
}

// verify email
export const sendVerifyEmail = async (receiverEmail: string, name: string, link: string) => {
  const emailHtml = render(VerifyEmail({ name, link }), { pretty: true })
  try {
    return await transporter.sendMail({
      from: `"JW Centrs help 🚀" <${process.env.GMAIL_EMAIL}>`,
      to: receiverEmail,
      subject: 'Подтверждение эл. почты',
      //html: `Намите на эту <a href="${link}">ссылку</a> для подтверждения вашей эл. почты. <br/> Сылка годна в течение часа.`,
      html: emailHtml,
    })
  } catch (err) {
    console.log(err)
    throw new Error('Ошибка!')
  }
}
