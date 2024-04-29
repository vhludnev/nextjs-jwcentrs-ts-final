import { Body, Button, Container, Head, Html, Img, Preview, Section, Text } from '@react-email/components'

interface VerifyEmailProps {
  name?: string
  link?: string
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

export default function VerifyEmail({ name, link }: VerifyEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>JW Centrs Замена пароля</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img style={image} src={`${baseUrl}/196x196.jpg`} width='40' height='40' alt='JW Daugavpils' />
          <Section>
            <Text style={text}>Привет, {name}!</Text>
            <Text style={text}>
              Для подтверждения твоего адреса эл. почты и успешного создания учётной записи на JW Centrs нажми на эту
              ссылку.
            </Text>
            <Text style={text}>Ссылка будет годна в течение часа:</Text>
            <Button style={button} href={link}>
              Подтвердить
            </Button>
            <Text style={text}>JW Centrs</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

VerifyEmail.PreviewProps = {
  name: 'Slava',
  link: 'https://jwcentrs.vercel.app/auth/verify',
} as VerifyEmailProps

const main = {
  backgroundColor: '#f6f9fc',
  padding: '10px 0',
}

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #f0f0f0',
  padding: '45px',
}

const image = { borderRadius: '2px' }

const text = {
  fontSize: '16px',
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: '300',
  color: '#404040',
  lineHeight: '26px',
}

const button = {
  backgroundColor: '#007ee6',
  borderRadius: '4px',
  color: '#fff',
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: '15px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '210px',
  padding: '14px 7px',
}

// const anchor = {
//   textDecoration: 'underline',
// }
