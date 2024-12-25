import type { NextPage } from "next";
import Head from "next/head";
import {
  Gallery,
  Carousal

} from "../components/Gallery";
//import CreateNewBlog from "../components/Members/Admin/createblog";
import { SecFooter } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { ChatButton } from "../components/Chat";

const GalleryImages: NextPage = () => {
  return (
    <>
      <Head>
        <title>Zine | Gallery</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Navbar />
      <ChatButton />
      <Carousal />
      <Gallery />
      {/* <CreateNewBlog /> */}
      <SecFooter />
    </>
  );
};

export default GalleryImages;
