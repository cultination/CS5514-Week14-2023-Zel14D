import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';

interface Post {
  ID: number;
  post_title: string;
  post_content: string;
}

interface HomeProps {
  latestPosts?: Post[];
}

const Home: NextPage<HomeProps> = ({ latestPosts }) => {
  // State to track the currently displayed post
  const [currentPost, setCurrentPost] = useState<Post | null>(null);

  // Function to handle post selection
  const handlePostClick = (post: Post) => {
    setCurrentPost(post);
  };

  // Function to handle navigating back to post list
  const handleBackToList = () => {
    setCurrentPost(null);
  };

  return (
    <div style={styles.container}>
      <Head>
        <title>WPNext Blog</title>
        <meta name="description" content="WordPress Next.js App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={styles.main}>
        {currentPost ? ( // If a post is selected, show detailed view
          <div>
            <h1 style={styles.heading}>{currentPost.post_title}</h1>
            <div dangerouslySetInnerHTML={{ __html: currentPost.post_content }} />
            <button onClick={handleBackToList} style={styles.backButton}>
              Back to List
            </button>
          </div>
        ) : (
          // If no post is selected, show the list
          <div>
            <h1 style={styles.heading}>Explore the Latest Posts</h1>
            <div style={styles.postsContainer}>
              {Array.isArray(latestPosts) ? (
                latestPosts.map((post) => (
                  <div key={post.ID} style={styles.post} onClick={() => handlePostClick(post)}>
                    <h2 style={styles.postTitle}>{post.post_title}</h2>
                  </div>
                ))
              ) : (
                <p>No posts to display</p>
              )}
            </div>
          </div>
        )}
      </main>

      <footer style={styles.footer}>
        <a href="/__repl" target="_blank" rel="noopener noreferrer" style={styles.footerLink}>
          Built on
          <span style={styles.logoContainer}>
            <Image src="/replit.svg" alt="Replit Logo" width={20} height={18} />
          </span>
          Replit
        </a>
      </footer>
    </div>
  );
};

// Updated styles object with additional styling for the Back to List button
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    padding: '0 2rem',
  } as React.CSSProperties,
  main: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: '5rem',
  } as React.CSSProperties,
  heading: {
    margin: '0',
    lineHeight: '1.15',
    fontSize: '4rem',
  } as React.CSSProperties,
  postsContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    maxWidth: '800px',
  } as React.CSSProperties,
  post: {
    margin: '1rem',
    padding: '1.5rem',
    textAlign: 'left',
    color: 'inherit',
    textDecoration: 'none',
    border: '1px solid #eaeaea',
    borderRadius: '10px',
    transition: 'color 0.15s ease, border-color 0.15s ease',
    display: 'flex',
    flexDirection: 'column',
  } as React.CSSProperties,
  postTitle: {
    margin: '0 0 1rem 0',
    fontSize: '1.5rem',
  } as React.CSSProperties,
  footer: {
    flexShrink: '0',
    display: 'flex',
    padding: '2rem 0',
    borderTop: '1px solid #eaeaea',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed',
    bottom: '0',
    width: '100%',
    background: '#fff',
  } as React.CSSProperties,
  footerLink: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: '1',
  } as React.CSSProperties,
  logoContainer: {
    height: '1em',
    marginLeft: '0.2rem',
  } as React.CSSProperties,
  backButton: {
    marginTop: '1rem',
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  } as React.CSSProperties,
};

// ISR setup
export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const endpointUrl = 'https://dev-site4school.pantheonsite.io/wp-json/twentytwentyone-child/v1/latest-posts/1';

  try {
    const response = await fetch(endpointUrl);
    const latestPosts = await response.json();

    return {
      props: {
        latestPosts,
      },
      revalidate: 60, // Re-generate the page every 60 seconds
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