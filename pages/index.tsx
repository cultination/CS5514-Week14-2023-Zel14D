import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useInView } from 'react-intersection-observer';

interface Team {
  id: number; // Updated field name
  team_name: string;
  ucl_wins: number;
  team_description: string;
}

interface HomeProps {
  teams?: Team[];
}

const Home: NextPage<HomeProps> = ({ teams }) => {
  // State to track the currently displayed team
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  // State to track whether animation should be triggered
  const [animate, setAnimate] = useState(false);
  // Ref to track the intersection of the trigger element
  const { ref, inView } = useInView();
  // Media query to check for mobile devices
  const isMobile = useMediaQuery({ maxWidth: 767 });

  // useEffect to handle animation trigger
  useEffect(() => {
    if (inView) {
      setAnimate(true);
    }
  }, [inView]);

  // Function to handle team selection
  const handleTeamClick = (team: Team) => {
    setCurrentTeam(team);
  };

  // Function to handle navigating back to team list
  const handleBackToList = () => {
    setCurrentTeam(null);
  };

  return (
    <div style={styles.container}>
      <Head>
        <title>Top UCL Teams</title>
        <meta name="description" content="Top UCL Teams" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={styles.main}>
        {currentTeam ? ( // If a team is selected, show detailed view
          <div>
            <h1 style={styles.heading}>{currentTeam.team_name}</h1>
            <p>UEFA Champions League Wins: {currentTeam.ucl_wins}</p>
            <p>Description: {currentTeam.team_description}</p>
            <button onClick={handleBackToList} style={styles.backButton}>
              Back to List
            </button>
          </div>
        ) : (
          // If no team is selected, show the list
          <div>
            <h1 style={styles.heading}>Top UCL Teams</h1>
            <div style={styles.teamsContainer}>
              {Array.isArray(teams) ? (
                teams.map((team) => (
                  <div
                    key={team.id} // Updated field name
                    style={{ ...styles.team, animation: animate ? 'fadeIn 0.5s ease-in-out' : 'none' }}
                    onClick={() => handleTeamClick(team)}
                  >
                    <h2 style={styles.teamName}>{team.team_name}</h2>
                  </div>
                ))
              ) : (
                <p>No teams to display</p>
              )}
            </div>
            {/* Trigger element for animation */}
            <div ref={ref} style={styles.triggerElement}></div>
          </div>
        )}
      </main>

      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <a href="/__repl" target="_blank" rel="noopener noreferrer" style={styles.footerLink}>
            Built on
            <span style={styles.logoContainer}>
              <Image src="/replit.svg" alt="Replit Logo" width={20} height={18} />
            </span>
            Replit
          </a>
        </div>
      </footer>
    </div>
  );
};

// Updated styles object with additional styling for animation and background image
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    padding: '0 2rem',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
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
    color: '#black',
  } as React.CSSProperties,
  teamsContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    maxWidth: '800px',
  } as React.CSSProperties,
  team: {
    margin: '1rem',
    padding: '1.5rem',
    textAlign: 'left',
    color: 'black',
    textDecoration: 'none',
    border: '1px solid #eaeaea',
    borderRadius: '10px',
    transition: 'color 0.15s ease, border-color 0.15s ease',
    display: 'flex',
    flexDirection: 'column',
  } as React.CSSProperties,
  teamName: {
    margin: '0 0 1rem 0',
    fontSize: '1.5rem',
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
  footer: {
    flexShrink: '0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed',
    bottom: '0',
    width: '100%',
    background: 'transparent',
  } as React.CSSProperties,
  footerContent: {
    padding: '2rem 0',
    borderTop: '1px solid #eaeaea',
  } as React.CSSProperties,
  footerLink: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: '1',
    color: '#00000',
    textDecoration: 'none',
  } as React.CSSProperties,
  logoContainer: {
    height: '1em',
    marginLeft: '0.2rem',
  } as React.CSSProperties,
  triggerElement: {
    width: '1px',
    height: '1px',
    position: 'absolute',
    top: 0,
    left: 0,
  } as React.CSSProperties,
};

// ISR setup
export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const endpointUrl = 'https://dev-site4school.pantheonsite.io/wp-json/twentytwentyone-child/v1/teams';

  try {
    const response = await fetch(endpointUrl);
    const teams = await response.json();

    return {
      props: {
        teams,
      },
      revalidate: 60, // Re-generate the page every 60 seconds
    };
  } catch (error) {
    console.error('Error fetching teams:', error);
    return {
      props: {
        teams: [],
      },
    };
  }
};

export default Home;