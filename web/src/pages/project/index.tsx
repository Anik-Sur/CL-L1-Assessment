import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import ProjectPage from "@/components/ProjectPage";

const inter = Inter({ subsets: ["latin"] });


export default function ProjectPages() {
    return <ProjectPage />;
}