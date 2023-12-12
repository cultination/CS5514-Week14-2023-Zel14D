import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';

interface Team {
  ID: number;
  team_name: string;
  ucl_wins: number;
  team_description: string;
}

interface TeamProps {
  team?: Team;
}

const TeamPage: NextPage<TeamProps> = ({ team }) => {
  if (!team) {
    return (
      <div>
        <p>Team not found</p>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>{team.team_name}</title>
        <meta name="description" content={team.team_name} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>{team.team_name}</h1>
        <p>UCL Wins: {team.ucl_wins}</p>
        <p>Description: {team.team_description}</p>
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
  try {
    // Fetch the list of all teams from your API
    const teamsResponse = await fetch('https://dev-site4school.pantheonsite.io/wp-json/twentytwentyone-child/v1/teams');
    const teams = await teamsResponse.json();

    // Generate paths for each team ID
    const paths = teams.map((team: Team) => ({
      params: { id: team.ID.toString() },
    }));

    return {
      paths,
      fallback: false,
    };
  } catch (error) {
    console.error('Error fetching team paths:', error);

    return {
      paths: [],
      fallback: false,
    };
  }
};

export const getStaticProps: GetStaticProps<TeamProps> = async ({ params }) => {
  try {
    // Fetch all teams
    const teamsResponse = await fetch('https://dev-site4school.pantheonsite.io/wp-json/twentytwentyone-child/v1/teams');
    const teams = await teamsResponse.json();

    if (!params || !params.id) {
      return {
        notFound: true,
      };
    }

    // Find the specific team data based on the ID
    const team = teams.find((t: Team) => t.ID.toString() === params.id);

    if (!team) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        team,
      },
    };
  } catch (error) {
    console.error('Error fetching team data:', error);

    return {
      notFound: true,
    };
  }
};

export default TeamPage;
