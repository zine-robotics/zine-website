import type { NextPage } from "next";
import Head from "next/head";
import {
  Projects,
} from "../../components/Members/Users";
import { AuthContextProvider } from "../../context/authContext";


const Home: NextPage = () => {
  return (
    <AuthContextProvider>
      <Head>
        <title>Zine | Users</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Projects />
    </AuthContextProvider>
  );
};

export default Home;