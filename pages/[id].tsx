import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';

interface Post {
  ID: number;
  post_title: string;
  post_content: string;
}

interface PostProps {
  post?: Post;
}

const PostPage: NextPage<PostProps> = ({ post }) => {
  if (!post) {
    return (
      <div>
        <p>Post not found</p>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>{post.post_title}</title>
        <meta name="description" content={post.post_title} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>{post.post_title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.post_content }} />
      </main>

      <footer>
        <a
          href="/__repl"
          target="_blank"
          rel="noopener noreferrer"
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

export const getStaticPaths: GetStaticPaths = async () => {
  // Fetch the list of post IDs from your API
  const endpointUrl = 'https://dev-site4school.pantheonsite.io/wp-json/twentytwentyone-child/v1/special';
  const response = await fetch(endpointUrl);
  const posts = await response.json();

  // Generate paths for each post ID
  const paths = posts.map((post: Post) => ({
    params: { id: post.ID.toString() },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PostProps> = async ({ params }) => {
  if (!params || !params.id) {
    return {
      notFound: true,
    };
  }

  // Fetch the specific post data based on the ID
  const postUrl = `https://dev-site4school.pantheonsite.io/wp-json/twentytwentyone-child/v1/special/${params.id}`;
  const response = await fetch(postUrl);
  const post = await response.json();

  return {
    props: {
      post,
    },
  };
};

export default PostPage;
