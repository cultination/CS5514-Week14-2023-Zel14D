import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';

interface Post {
  ID: number;
  post_title: string;
  post_content: string;
}

interface HomeProps {
  latestPosts?: Post[];
}

const Home: NextPage<HomeProps> = ({ latestPosts }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', padding: '0 2rem' }}>
      <Head>
        <title>WPNext Blog</title>
        <meta name="description" content="WordPress Next.js App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingBottom: '5rem' }}>
        <h1 style={{ margin: '0', lineHeight: '1.15', fontSize: '4rem' }}>
          Explore the Latest Posts
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', maxWidth: '800px' }}>
          {latestPosts?.map((post) => (
            <div key={post.ID} style={{ margin: '1rem', padding: '1.5rem', textAlign: 'left', color: 'inherit', textDecoration: 'none', border: '1px solid #eaeaea', borderRadius: '10px', transition: 'color 0.15s ease, border-color 0.15s ease', display: 'flex', flexDirection: 'column' }}>
              <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem' }}>{post.post_title}</h2>
              <div dangerouslySetInnerHTML={{ __html: post.post_content }} />
            </div>
          ))}
        </div>
      </main>

      <footer style={{ flexShrink: '0', display: 'flex', padding: '2rem 0', borderTop: '1px solid #eaeaea', justifyContent: 'center', alignItems: 'center', position: 'fixed', bottom: '0', width: '100%', background: '#fff' }}>
        <a
          href="/__repl"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: '1' }}
        >
          Built on
          <span style={{ height: '1em', marginLeft: '0.2rem' }}>
            <Image src="/replit.svg" alt="Replit Logo" width={20} height={18} />
          </span>
          Replit
        </a>
      </footer>
    </div>
  );
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const endpointUrl = 'https://dev-site4school.pantheonsite.io/wp-json/twentytwentyone-child/v1/latest-posts/1';

  try {
    const response = await fetch(endpointUrl);
    const latestPosts = await response.json();

    return {
      props: {
        latestPosts,
      },
    };
  } catch (error) {
    console.error('Error fetching latest posts:', error);
    return {
      props: {
        latestPosts: [],
      },
    };
  }
};

export default Home;
