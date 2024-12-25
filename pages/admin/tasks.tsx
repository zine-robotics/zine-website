import type { NextPage } from "next";
import Head from "next/head";
import { AuthContextProvider } from "../../context/authContext";
import { Tasks } from "../../components/Members/Admin";


const Home: NextPage = () => {
  return (
    <AuthContextProvider>
      <Head>
        <title>Zine | Admin</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Tasks />
    </AuthContextProvider>
  );
};

export default Home;
