import "@/styles/globals.css";
import 'antd/dist/reset.css';
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import ProjectProvider from "@/context/ProjectContext";
import TaskProvider from "@/context/TaskContext";
import UserProvider from "@/context/UserContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <ProjectProvider>
        <TaskProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </TaskProvider>
      </ProjectProvider>
    </UserProvider>

  );
}
