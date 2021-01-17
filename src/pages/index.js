import Head from 'next/head'
import { getGithubPreviewProps, parseJson } from 'next-tinacms-github'
import { usePlugin } from 'tinacms'
import { useGithubJsonForm } from 'react-tinacms-github'

import { Hero } from '../components/Hero'
import { Container } from '../components/Container'
import { Main } from '../components/Main'
import { CTA } from '../components/CTA'
import { Footer } from '../components/Footer'
import About from '../components/About'
import Header from '../components/Header'

const Index = ({ file={} }) => {
  const formOptions = {
    label: 'Home Page',
    fields: [{ name: 'title', component: 'text' }, { name: 'body', component: 'markdown' }],
  }
  const [data, form] = useGithubJsonForm(file, formOptions)
  usePlugin(form)
  return (
    <>
      <Head>
        <title>OSCA | Oberlin Student Cooperative Association</title>
      </Head>
      <Header />
      <Container>
        <Hero />
        <Main>
          <About data={data} />
        </Main>
        <Footer />
        <CTA />
      </Container>
    </>
  )
}

export default Index

/**
 * Fetch data with getStaticProps based on 'preview' mode
 */
export async function getStaticProps ({ preview, previewData }) {
  if (preview) {
    return getGithubPreviewProps({
      ...previewData,
      fileRelativePath: 'content/index.json',
      parse: parseJson
    })
  }
  return {
    props: {
      sourceProvider: null,
      error: null,
      preview: false,
      file: {
        fileRelativePath: 'content/index.json',
        data: (await import('../content/index.json')).default
      }
    }
  }
}
